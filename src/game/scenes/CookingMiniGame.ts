import { GameObjects, Scene } from "phaser";
import { EventBus } from "../EventBus";
import { recipes } from "./Recipes";
import { GameRewardService } from "../../services/GameRewardService";

type StationType = 'stove' | 'cutting_board' | 'ingredient_shelf' | 'garbage_bin';
type IngredientState = 'raw' | 'chopped' | 'cooked' | 'ash';

interface CookingStation {
    sprite: Phaser.GameObjects.Rectangle | Phaser.GameObjects.Sprite;
    type: StationType;
    inUse: boolean;
    progress?: number;
    progressBar?: Phaser.GameObjects.Sprite;
    currentIngredient?: Phaser.GameObjects.Sprite;
    ingredientType?: string;
    ingredientState?: IngredientState;
    preview?: Phaser.GameObjects.Sprite;
    ingredientStateAtStart?: IngredientState;
}

interface Ingredient {
    sprite: Phaser.GameObjects.Sprite;
    type: string;
    state: IngredientState;
}

interface Pot {
    sprite: Phaser.GameObjects.Sprite;
    contents: { type: string; state: string; quantity: number }[];
    isOnStove: boolean;
    isCooked: boolean;
}

export class CookingMiniGame extends Scene {
    private player!: Phaser.GameObjects.Sprite;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private stations: CookingStation[] = [];
    private heldIngredient?: Ingredient;
    private pot?: Pot;
    
    constructor() {
        super('CookingMiniGame');
    }

    create() {
        // this.handleWin();
        // Create a larger background (150% of canvas size)
        this.add.tileSprite(0, 0, 3072, 2304, 'wood_floor')
            .setOrigin(0, 0)
            .setScale(0.5);

        // Set up camera bounds
        this.cameras.main.setBounds(0, 0, 1536, 1152);
        
        // Create player
        this.player = this.add.sprite(400, 300, 'player-walking-down').setScale(0.5);
        this.physics.add.existing(this.player);
        
        const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
        playerBody.setCollideWorldBounds(true);
        playerBody.setSize(130, 270);

        // Set world bounds for physics
        this.physics.world.setBounds(0, 0, 1536, 1152);

        // Make camera follow player
        this.cameras.main.startFollow(this.player, true);
        this.cameras.main.setZoom(1);

        // Set base depths
        this.player.setDepth(10); // Higher base depth for player

        // Create ingredient stations at bottom left with more spacing
        const ingredients = ['onion', 'tomato', 'carrot', 'potato', 'salmon', 'ham', 'beef', 'rice', 'dough'];
        const startX = 200;  
        const startY = 1000;
        const spacing = 200;  
        
        ingredients.forEach((ingredient, index) => {
            // Create the station first
            this.createStation(startX + (index * spacing), startY, 'ingredient_shelf', ingredient);
            
            // Add ingredient preview above the station
            this.add.sprite(startX + (index * spacing), startY - 20, 'ingredients', 
                this.getIngredientFrame(ingredient, 'raw'))
                .setScale(0.4);
        });

        // Create other stations
        this.createStation(200, 150, 'stove');
        this.createStation(600, 150, 'cutting_board');

        // Create garbage bin
        this.createStation(700, 500, 'garbage_bin');

        // Create pot
        const potSprite = this.add.sprite(300, 300, 'pot').setScale(0.5);
        this.pot = {
            sprite: potSprite,
            contents: [],
            isOnStove: false,
            isCooked: false
        };

        this.physics.add.existing(potSprite, false);
        const potBody = potSprite.body as Phaser.Physics.Arcade.StaticBody;
        potBody.setSize(potSprite.displayWidth * 0.5, potSprite.displayHeight * 0.5)
            // .setOffset(potSprite.displayWidth * 0.1, potSprite.displayHeight * 0.1) // Adjust hitbox size and offset
        potBody.setImmovable(true);

        this.physics.add.collider(this.player, potSprite);

        // Setup keyboard input
        this.cursors = this.input.keyboard?.createCursorKeys() as Phaser.Types.Input.Keyboard.CursorKeys;

        // Add interaction key
        this.input.keyboard?.on('keydown-SPACE', () => this.handleInteraction());
        this.input.keyboard?.on('keydown-ESC', () => {
            this.isPaused = !this.isPaused;
            if(this.isPaused) {
                this.scene.launch('PauseMenu');
                this.scene.pause();
            } else {
                this.scene.resume();
            }
        });

        EventBus.emit('current-scene-ready', this);
    }

    private createStation(x: number, y: number, type: StationType, ingredientType?: string) {
        let sprite: Phaser.GameObjects.Sprite | Phaser.GameObjects.Rectangle;

        if (type === 'garbage_bin') {
            sprite = this.add.rectangle(x, y, 100, 100, 0x888888);
            this.physics.add.existing(sprite, true);
            const body = sprite.body as Phaser.Physics.Arcade.StaticBody;
            body.setSize(100, 100); // Ensure the size matches the visual representation
            // body.setOffset(-32, -32); // Center the body

            this.stations.push({ sprite, type, inUse: false});
            this.physics.add.collider(this.player, sprite);
            return;
        }
        if (type === 'stove') {
            sprite = this.add.sprite(x, y, 'cooking_stations', 2).setScale(0.5);
            sprite.play('stove-burning');
            this.physics.add.existing(sprite, true);
            const body = sprite.body as Phaser.Physics.Arcade.Body;
            body.setSize(100, 50).setOffset(17, 60); // Adjust stove hitbox size and offset
        } 
        if (type === 'cutting_board') {
            sprite = this.add.sprite(x, y, 'cooking_stations', 0).setScale(0.5);
            this.physics.add.existing(sprite, true);
            const body = sprite.body as Phaser.Physics.Arcade.Body;
            body.setSize(100, 20)
            // .setOffset(17, 80); // Adjust cutting board hitbox size and offset
        }
        if (type === 'ingredient_shelf') {
            sprite = this.add.sprite(x, y, 'crate').setScale(0.5);
            this.physics.add.existing(sprite, true);
            const body = sprite.body as Phaser.Physics.Arcade.StaticBody;
            body.setSize(sprite.width * 0.5, sprite.height * 0.5);


            // Add ingredient preview
            const preview = this.add.sprite(x, y - 20, 'ingredients', this.getIngredientFrame(ingredientType!, 'raw'))
                .setScale(0.4)
                .setDepth(sprite.depth + 1); // Ensure preview is on top

            this.stations.push({ sprite, type, inUse: false, ingredientType, preview });
            this.physics.add.collider(this.player, sprite);
            return;
        } 
        if (type === 'garbage_bin') {
            sprite = this.add.rectangle(x, y, 64, 64, 0x888888);
            this.physics.add.existing(sprite, true);
        }

        const station: CookingStation = {
            sprite,
            type,
            inUse: false,
            progress: 0,
            ingredientType
        };

        if (type !== 'ingredient_shelf' && type !== 'garbage_bin') {
            station.progressBar = this.add.sprite(x, y - 80, 'progress_bar', 0)
                .setOrigin(0.5, 0.5)
                .setVisible(false)
                .setDepth(100)
                .setScale(0.5);
        }

        this.stations.push(station);
        this.physics.add.collider(this.player, sprite);
    }

    private handleInteraction() {
        const playerBounds = this.player.getBounds();
        let closestStation: CookingStation | null = null;
        let minDistance = Number.MAX_VALUE;

        let interactedWithStation = false;

        // Determine the direction the player is facing
        const match = this.player.anims.currentAnim?.key.match(/(left|up|down)/)?.[0] ?? '';
        const direction = match === 'left' ? this.player.flipX ? 'right' : 'left' : match;

        // Define offsets for facing direction
        const offsets = {
            left: { x: -1, y: 0 },
            right: { x: 1, y: 0 },
            up: { x: 0, y: -1 },
            down: { x: 0, y: 1 }
        };

        const offset = offsets[direction as keyof typeof offsets] || { x: 0, y: 1 };

        // Find the closest station the player is touching and facing
        this.stations.forEach(station => {
            const stationBounds = station.sprite.getBounds();
            if (Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, stationBounds)) {
                const vectorX = station.sprite.x - this.player.x;
                const vectorY = station.sprite.y - this.player.y;

                // Normalize the vector
                const length = Math.sqrt(vectorX * vectorX + vectorY * vectorY);
                const normalizedX = vectorX / length;
                const normalizedY = vectorY / length;

                // Check if the station is in the direction the player is facing
                const dotProduct = normalizedX * offset.x + normalizedY * offset.y;
                const interactionThreshold = 0.8; // Adjust this value as needed

                if (dotProduct > interactionThreshold) {
                    const distance = Phaser.Math.Distance.Between(
                        this.player.x,
                        this.player.y,
                        station.sprite.x,
                        station.sprite.y
                    );
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestStation = station;
                    }
                }
            }
        });

        if (closestStation) {
            switch (closestStation.type) {
                case 'ingredient_shelf':
                    if (!this.heldIngredient) {
                        // Pick up a new ingredient from the shelf
                        const ingredient = this.add.sprite(
                            closestStation.sprite.x,
                            closestStation.sprite.y - 40,
                            'ingredients',
                            this.getIngredientFrame(closestStation.ingredientType!, 'raw')
                        ).setScale(0.5);

                        this.heldIngredient = {
                            sprite: ingredient,
                            type: closestStation.ingredientType!,
                            state: 'raw'
                        };
                    }
                    interactedWithStation = true;
                    break;
                case 'garbage_bin':
                    if (this.heldIngredient && this.heldIngredient.type !== 'pot') {
                        // Discard the held ingredient
                        this.heldIngredient.sprite.destroy();
                        this.heldIngredient = undefined;
                    } else if (this.pot && this.pot.contents.length > 0) {
                        // Empty the pot
                        this.pot.contents = [];
                        this.pot.sprite.clearTint();
                    }
                    interactedWithStation = true;
                    break;
                case 'stove':
                    if (this.heldIngredient) {
                        if (this.heldIngredient.type === 'pot') {
                            // Place pot on stove
                            this.pot!.isOnStove = true;
                            this.pot?.sprite.setPosition(closestStation.sprite.x, closestStation.sprite.y - 40);
                            this.pot?.sprite.setVisible(true); // Ensure the pot is visible
                            this.physics.world.enable(this.pot!.sprite); // Re-enable the pot's hitbox
                            this.heldIngredient = undefined;
                            closestStation.progress = 0;
                            closestStation.inUse = true;
                            closestStation.progressBar?.setVisible(true);
                            interactedWithStation = true;
                        } else {
                            // Place other ingredients on stove
                            closestStation.currentIngredient = this.heldIngredient.sprite;
                            closestStation.ingredientType = this.heldIngredient.type;
                            closestStation.ingredientState = this.heldIngredient.state;
                            closestStation.ingredientStateAtStart = this.heldIngredient.state;
                            closestStation.currentIngredient.setPosition(closestStation.sprite.x, closestStation.sprite.y - 40);
                            closestStation.currentIngredient.setDepth(closestStation.sprite.depth + 1);
                            closestStation.currentIngredient.setVisible(true); // Ensure the ingredient is visible
                            this.heldIngredient = undefined;
                            closestStation.inUse = true;
                            closestStation.progressBar?.setVisible(true);
                            closestStation.progress = 0;
                        }
                    } else if (!this.heldIngredient && this.pot && this.pot.isOnStove) {
                        // Pick up the pot from the stove
                        this.heldIngredient = {
                            sprite: this.pot.sprite,
                            type: 'pot',
                            state: 'raw'
                        };
                        this.pot.isOnStove = false;
                        this.physics.world.disable(this.pot.sprite); // Disable the pot's hitbox
                        closestStation.inUse = false;
                        closestStation.progressBar?.setVisible(false);
                    } else if (!this.heldIngredient && closestStation.currentIngredient) {
                        // Pick up the cooked ingredient from the stove
                        this.heldIngredient = {
                            sprite: closestStation.currentIngredient,
                            type: closestStation.ingredientType!,
                            state: closestStation.ingredientState!
                        };
                        closestStation.currentIngredient = undefined;
                        closestStation.ingredientType = undefined;
                        closestStation.ingredientState = undefined;
                        closestStation.inUse = false;
                        closestStation.progressBar?.setVisible(false);
                    }
                    interactedWithStation = true;
                    break;
                case 'cutting_board':
                    // Prevent placing the pot on the cutting board
                    if (this.heldIngredient && this.heldIngredient.type === 'pot') {
                        // Do nothing, as the pot cannot be placed on the cutting board
                    } else {
                        // Handle other interactions with the cutting board
                        if (this.heldIngredient && !closestStation.currentIngredient) {
                            // Place the held ingredient on the station
                            this.heldIngredient.sprite.setVisible(true); // DO NOT REMOVE
                            closestStation.currentIngredient = this.heldIngredient.sprite;
                            closestStation.ingredientType = this.heldIngredient.type;
                            closestStation.ingredientState = this.heldIngredient.state;
                            closestStation.currentIngredient.setPosition(closestStation.sprite.x, closestStation.sprite.y - 40);
                            closestStation.currentIngredient.setDepth(closestStation.sprite.depth + 1); // Ensure ingredient is on top
                            this.heldIngredient = undefined;

                            if (closestStation.ingredientState === 'raw') {
                                closestStation.inUse = true;
                                closestStation.progressBar?.setVisible(true);
                            }
                        } else if (!this.heldIngredient && closestStation.currentIngredient) {
                            // Pick up the processed ingredient from the station
                            closestStation.progress = 0;
                            closestStation.inUse = false;
                            closestStation.progressBar?.setVisible(false);
                            debugger
                            this.heldIngredient = {
                                sprite: closestStation.currentIngredient,
                                type: closestStation.ingredientType!,
                                state: closestStation.ingredientState!
                            };
                            closestStation.currentIngredient = undefined;
                            closestStation.ingredientState = undefined;
                        }
                    }
                    interactedWithStation = true;
                    break;
                // default:
                //     if (this.heldIngredient && !closestStation.currentIngredient) {
                //         // Place the held ingredient on the station
                //         this.heldIngredient.sprite.setVisible(true); // DO NOT REMOVE
                //         closestStation.currentIngredient = this.heldIngredient.sprite;
                //         closestStation.ingredientType = this.heldIngredient.type;
                //         closestStation.ingredientState = this.heldIngredient.state;
                //         closestStation.currentIngredient.setPosition(closestStation.sprite.x, closestStation.sprite.y - 40);
                //         closestStation.currentIngredient.setDepth(closestStation.sprite.depth + 1); // Ensure ingredient is on top
                //         this.heldIngredient = undefined;

                //         if (closestStation.ingredientState === 'raw') {
                //             closestStation.inUse = true;
                //             closestStation.progressBar?.setVisible(true);
                //         }
                //     } else if (!this.heldIngredient && closestStation.currentIngredient) {
                //         // Pick up the processed ingredient from the station
                //         closestStation.progress = 0;
                //         closestStation.inUse = false;
                //         closestStation.progressBar?.setVisible(false);
                //         this.heldIngredient = {
                //             sprite: closestStation.currentIngredient,
                //             type: closestStation.ingredientType!,
                //             state: closestStation.ingredientState!
                //         };
                //         closestStation.currentIngredient = undefined;
                //         closestStation.ingredientState = undefined;
                //     }
                //     interactedWithStation = true;
                //     break;
            }
        }
        if(interactedWithStation) return
        // Handle pot interaction separately
        const potBounds = this.pot!.sprite.getBounds();
        if (Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, potBounds)) {
            if (this.heldIngredient && this.heldIngredient.type === 'pot') {
                // Place the pot down only if not too close to a station
                if (!closestStation || minDistance > 50) { // Adjust the distance threshold as needed
                    this.pot!.sprite.setPosition(this.player.x, this.player.y + 40); // Place the pot at the player's position
                    this.physics.world.enable(this.pot!.sprite); // Re-enable the pot's hitbox
                    this.pot!.sprite.setVisible(true); // Ensure the pot is visible
                    this.heldIngredient = undefined;
                }
            } else if (!this.heldIngredient) {
                // Pick up the pot
                this.heldIngredient = {
                    sprite: this.pot!.sprite,
                    type: 'pot',
                    state: 'raw'
                };
                this.physics.world.disable(this.pot!.sprite); // Disable the pot's hitbox
            } else if (this.heldIngredient && this.heldIngredient.type !== 'pot') {
                // Add ingredient to pot
                const existingIngredient = this.pot!.contents.find(item => item.type === this.heldIngredient.type && item.state === this.heldIngredient.state);
                if (existingIngredient) {
                    existingIngredient.quantity += 1;
                } else {
                    this.pot!.contents.push({
                        type: this.heldIngredient.type,
                        state: this.heldIngredient.state,
                        quantity: 1
                    });
                }
                this.heldIngredient.sprite.destroy();
                this.heldIngredient = undefined;
            }
        }
    }

    private cookPot() {
        if (!this.pot) return;

        const matchingRecipe = recipes.find(recipe => {
            return recipe.ingredients.every(ingredient => {
                const potIngredient = this.pot!.contents.find(item => item.type === ingredient.type && item.state === ingredient.state);
                return potIngredient && potIngredient.quantity === ingredient.quantity;
            });
        });

        if (matchingRecipe) {
            // Successful recipe
            this.pot.sprite.setTint(0x00ff00); // Tint green
            this.pot.contents = [{ type: matchingRecipe.name, state: 'cooked', quantity: 1 }];
            // this.scene.start('CookingMiniGameWinScreen');
            this.handleWin();
        } else {
            // Failed recipe
            this.pot.sprite.setTint(0xff0000); // Tint red
            this.pot.contents = [{ type: 'ash', state: 'ash', quantity: 1 }];
        }

        this.pot.isCooked = true;
    }

    update() {
        const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
        const speed = 300;

        // Reset velocity
        playerBody.setVelocity(0);

        // Handle movement and animations
        if (this.cursors.left.isDown) {
            playerBody.setVelocityX(-speed);
            this.player.setFlipX(false);
            if (this.heldIngredient) {
                this.player.play('walk-carry-left', true);
            } else {
                this.player.play('walk-left', true);
            }
        } else if (this.cursors.right.isDown) {
            playerBody.setVelocityX(speed);
            this.player.setFlipX(true);
            if (this.heldIngredient) {
                this.player.play('walk-carry-left', true);
            } else {
                this.player.play('walk-left', true);
            }
        }

        if (this.cursors.up.isDown) {
            playerBody.setVelocityY(-speed);
            if (!this.cursors.left.isDown && !this.cursors.right.isDown) {
                this.player.play('walk-up', true);
            }
        } else if (this.cursors.down.isDown) {
            playerBody.setVelocityY(speed);
            if (!this.cursors.left.isDown && !this.cursors.right.isDown) {
                if (this.heldIngredient) {
                    this.player.play('walk-carry-down', true);
                } else {
                    this.player.play('walk-down', true);
                }
            }
        }

        // Handle idle animations
        if (playerBody.velocity.x === 0 && playerBody.velocity.y === 0) {
            if (this.player.anims.currentAnim) {
                const direction = this.player.anims.currentAnim.key.match(/(left|up|down)/)![0];
                if (direction === 'up') {
                    this.player.play('idle-up', true);
                } else {
                    if (this.heldIngredient) {
                        this.player.play(`idle-carry-${direction}`, true);
                    } else {
                        this.player.play(`idle-${direction}`, true);
                    }
                }
            } else {
                if (this.heldIngredient) {
                    this.player.play('idle-carry-down', true);
                } else {
                    this.player.play('idle-down', true);
                }
            }
        }

        // Update held ingredient position smoothly
        if (this.heldIngredient) {
            const offsetX = this.player.anims.currentAnim?.key === 'walk-carry-down' || this.player.anims.currentAnim?.key === 'idle-carry-down' ? 0 : this.player.flipX ? 40 : -40; // Center horizontally
            const offsetY = 30; // Adjust vertically to keep it consistent
            this.heldIngredient.sprite.setPosition(this.player.x + offsetX, this.player.y + offsetY);
            this.heldIngredient.sprite.setDepth(20);
        }

        if (this.player.anims.currentAnim?.key === 'walk-up' || this.player.anims.currentAnim?.key === 'idle-up') {
            this.heldIngredient?.sprite.setVisible(false);
        } else {
            this.heldIngredient?.sprite.setVisible(true);
        }

        // Simple depth sorting
        this.stations.forEach(station => {
            if (station.type === 'stove' || station.type === 'cutting_board' || station.type === 'ingredient_shelf') {
                const stationDepth = this.player.y > station.sprite.y ? 5 : 15;
                station.sprite.setDepth(stationDepth);
                if (station.currentIngredient) {
                    station.currentIngredient.setDepth(stationDepth + 1);
                }
                if (station.preview) {
                    station.preview.setDepth(stationDepth + 1);
                }
            }
        });

        // Continuously update progress for stations
        this.stations.forEach(station => {
            if (station.inUse) {
                this.updateProgress(station);
            }
        });
    }

    private updateProgress(station: CookingStation) {
        const playerX = this.player.x;
        const playerY = this.player.y;

        const distance = Phaser.Math.Distance.Between(
            playerX,
            playerY,
            station.sprite.x,
            station.sprite.y
        );

        // Only update progress if the player is close enough
        if (distance <= 120 || station.type !== 'cutting_board') {
            const frameNumber = Math.floor((station.progress || 0) / 14.3);
            station.progress = (station.progress || 0) + 0.12; // Adjust the increment for smoother progress
            
            if (station.progressBar) {
                // Update progress bar frame
                station.progressBar.setFrame(frameNumber > 7 ? 7 : frameNumber);

                // Make progress bar blink red if progress is over 125
                if (station.progress > 125 && station.type !== 'cutting_board') {
                    const isRed = Math.floor(station.progress / 10) % 2 === 0;
                    station.progressBar.setTint(isRed ? 0xff0000 : 0xffffff);
                } else {
                    station.progressBar.clearTint();
                }
            }

            if (station.progress >= 100) {
                // Ensure the ingredient state is updated correctly based on station type
                if (station.currentIngredient) {
                    if (station.type === 'cutting_board') {
                        // For cutting board, simply chop the ingredient
                        if (station.ingredientState === 'raw') {
                            station.ingredientState = 'chopped';
                            const newFrame = this.getIngredientFrame(station.ingredientType!, station.ingredientState);
                            station.currentIngredient.setFrame(newFrame);
                            station.progress = 0; // Reset progress
                            station.inUse = false;
                            station.progressBar?.setVisible(false); // Hide progress bar
                        }
                    } else if (station.type === 'stove') {
                        const shouldNotCookAlone = ['carrot', 'tomato', 'onion', 'potato', 'rice', 'dough'];
                        const isOvercooked = station.progress >= 150; // Burn threshold

                        if (shouldNotCookAlone.includes(station.ingredientType!) || isOvercooked || station.ingredientStateAtStart !== 'chopped') {
                            // Turn to ash
                            station.ingredientState = 'ash';
                            station.currentIngredient.setFrame(this.getIngredientFrame(station.ingredientType!, station.ingredientState));
                        } else if (station.progress < 150) {
                            station.ingredientState = 'cooked';
                            const newFrame = this.getIngredientFrame(station.ingredientType!, station.ingredientState);
                            station.currentIngredient.setFrame(newFrame);
                        }
                    }
                }

                // Trigger cookPot if the pot is on the stove and progress reaches 100
                if (station.type === 'stove' && this.pot && this.pot.isOnStove && !this.pot.isCooked) {
                    this.cookPot();
                    station.progress = 0; // Reset progress after cooking
                    station.inUse = false;
                    station.progressBar?.setVisible(false); // Hide progress bar
                }
            }
        }
    }

    private getIngredientFrame(type: string, state: IngredientState): number {
        if (state === 'ash') return 10
        const ingredients = ['onion', 'tomato', 'carrot', 'potato', 'salmon', 'ham', 'beef', 'rice', 'dough', 'null', 'ash'];
        const baseIndex = ingredients.indexOf(type);
        
        if (baseIndex === -1) return 0;
        
        // Raw ingredients are frames 0-4
        // Chopped ingredients are frames 5-9 in same order
        return state === 'chopped' ? baseIndex + 11 : state === 'cooked' ? baseIndex + 22 : baseIndex;
    }

    async handleWin() {
        try {
            // Show loading UI
            const loadingText = this.add.text(512, 384, 'Claiming reward...', {
                fontFamily: 'DePixel-bold',
                fontSize: 24,
                color: '#ffffff'
            }).setOrigin(0.5);

            // Try to claim treasure chest
            const success = await GameRewardService.claimTreasureChest();

            if (success) {
                // Show success message
                loadingText.setText('Reward claimed!');
                
                // Wait 2 seconds then return to overworld
                this.time.delayedCall(2000, () => {
                    this.scene.start('Overworld');
                });
            } else {
                loadingText.setText('Failed to claim reward.\nDo you own a Shapecraft Key?');
                
                // Add retry button (store reference only if needed)
                this.add.text(512, 450, 'Retry', {
                    fontFamily: 'DePixel-bold',
                    fontSize: 20,
                    color: '#ffffff'
                })
                .setOrigin(0.5)
                .setInteractive()
                .on('pointerdown', () => this.handleWin());
            }
        } catch (error) {
            console.error("Error in handleWin:", error);
        }
    }
}