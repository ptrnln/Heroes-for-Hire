import { GameObjects, Scene } from "phaser";
import { EventBus } from "../EventBus";

interface CookingStation {
    sprite: Phaser.GameObjects.Rectangle;
    type: 'stove' | 'cutting_board' | 'ingredient_shelf' | 'garbage_bin';
    inUse: boolean;
    progress?: number;
    progressBar?: Phaser.GameObjects.Sprite;
    currentIngredient?: Phaser.GameObjects.Sprite;
    ingredientType?: string;
    ingredientState?: 'raw' | 'chopped' | 'cooked';
}

interface Ingredient {
    sprite: Phaser.GameObjects.Sprite;
    type: string;
    state: 'raw' | 'chopped' | 'cooked';
}

export class CookingMiniGame extends Scene {
    private player!: Phaser.GameObjects.Sprite;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private stations: CookingStation[] = [];
    private heldIngredient?: Ingredient;
    
    constructor() {
        super('CookingMiniGame');
    }

    create() {
        // Setup background
        this.add.rectangle(0, 0, 800, 600, 0xcccccc).setOrigin(0, 0);

        // Create player
        this.player = this.add.sprite(400, 300, 'player-walking-down').setScale(0.5);
        this.physics.add.existing(this.player);
        
        const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
        playerBody.setCollideWorldBounds(true);
        playerBody.setSize(130, 270);

        // Create stations
        this.createStation(200, 150, 'stove', 0xff0000);
        this.createStation(600, 150, 'cutting_board', 0x00ff00);

        // Create ingredient stations
        this.createStation(100, 500, 'ingredient_shelf', 0xffff00, 'onion');
        this.createStation(200, 500, 'ingredient_shelf', 0xffff00, 'tomato');
        this.createStation(300, 500, 'ingredient_shelf', 0xffff00, 'carrot');
        this.createStation(400, 500, 'ingredient_shelf', 0xffff00, 'potato');
        this.createStation(500, 500, 'ingredient_shelf', 0xffff00, 'salmon');

        // Create garbage bin
        this.createStation(700, 500, 'garbage_bin', 0x888888);

        // Setup keyboard input
        this.cursors = this.input.keyboard?.createCursorKeys() as Phaser.Types.Input.Keyboard.CursorKeys;

        // Add interaction key
        this.input.keyboard?.on('keydown-SPACE', () => this.handleInteraction());

        EventBus.emit('current-scene-ready', this);
    }

    private createStation(x: number, y: number, type: 'stove' | 'cutting_board' | 'ingredient_shelf' | 'garbage_bin', color: number, ingredientType?: string) {
        const sprite = this.add.rectangle(x, y, 64, 64, color);
        this.physics.add.existing(sprite, true); // true makes it static

        const station: CookingStation = {
            sprite,
            type,
            inUse: false,
            progress: 0,
            ingredientType
        };

        // Only add progress bars for cooking/cutting stations
        if (type !== 'ingredient_shelf' && type !== 'garbage_bin') {
            station.progressBar = this.add.sprite(x, y - 40, 'progress_bar', 0)
                .setOrigin(0.5, 0.5)
                .setVisible(false)
                .setDepth(100)
                .setScale(0.5);
        }

        this.stations.push(station);
        
        // Add collision with player
        this.physics.add.collider(this.player, sprite);
    }

    private handleInteraction() {
        const playerX = this.player.x;
        const playerY = this.player.y;

        this.stations.forEach(station => {
            const distance = Phaser.Math.Distance.Between(
                playerX,
                playerY,
                station.sprite.x,
                station.sprite.y
            );

            if (distance < 120) {
                if (station.type === 'ingredient_shelf') {
                    if (!this.heldIngredient && !station.currentIngredient) {
                        // Create new ingredient using spritesheet
                        const ingredient = this.add.sprite(
                            station.sprite.x,
                            station.sprite.y - 40,
                            'ingredients',
                            this.getIngredientFrame(station.ingredientType!, 'raw')
                        ).setScale(0.5)
                        .setOrigin(0.5, 0.5);

                        this.heldIngredient = {
                            sprite: ingredient,
                            type: station.ingredientType!, // Store the ingredient type
                            state: 'raw'
                        };
                    }
                } else if (station.type === 'garbage_bin') {
                    if (this.heldIngredient) {
                        // Remove the held ingredient
                        this.heldIngredient.sprite.destroy();
                        this.heldIngredient = undefined;
                    }
                } else {
                    if (this.heldIngredient && !station.currentIngredient) {
                        // Place ingredient on station
                        this.heldIngredient.sprite.setVisible(true);
                        station.currentIngredient = this.heldIngredient.sprite;
                        station.ingredientType = this.heldIngredient.type; // Save the ingredient type to the station
                        station.ingredientState = this.heldIngredient.state;
                        station.currentIngredient.setPosition(station.sprite.x, station.sprite.y);
                        this.heldIngredient = undefined;
                        
                        if (station.ingredientState === 'raw') {
                            station.inUse = true;
                            station.progressBar?.setVisible(true);
                        }
                    } else if (!this.heldIngredient && station.currentIngredient) {
                        // Pick up processed ingredient
                        this.heldIngredient = {
                            sprite: station.currentIngredient,
                            type: station.ingredientType!,
                            state: station.ingredientState!
                        };
                        station.currentIngredient = undefined;
                        station.ingredientState = undefined;
                    }
                }
            }
        });
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
            this.player.play('walk-left', true);
        } else if (this.cursors.right.isDown) {
            playerBody.setVelocityX(speed);
            this.player.setFlipX(true);
            this.player.play('walk-left', true);
        }

        if (this.cursors.up.isDown) {
            playerBody.setVelocityY(-speed);
            if (!this.cursors.left.isDown && !this.cursors.right.isDown) {
                this.player.play('walk-up', true);
            }
        } else if (this.cursors.down.isDown) {
            playerBody.setVelocityY(speed);
            if (!this.cursors.left.isDown && !this.cursors.right.isDown) {
                this.player.play('walk-down', true);
            }
        }

        // Handle idle animations
        if (playerBody.velocity.x === 0 && playerBody.velocity.y === 0) {
            if (this.player.anims.currentAnim) {
                const direction = this.player.anims.currentAnim.key.split('-')[1];
                this.player.play(`idle-${direction}`, true);
            } else {
                this.player.play('idle-down', true);
            }
        }

        // Update held ingredient position
        if (this.heldIngredient) {
            this.heldIngredient.sprite.setPosition(
                this.player.x,
                this.player.y + 40
            );
        }

        if(this.player.anims.currentAnim?.key === 'walk-up' || this.player.anims.currentAnim?.key === 'idle-up') {
            this.heldIngredient?.sprite.setVisible(false);
        } else {
            this.heldIngredient?.sprite.setVisible(true);
        }

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
            station.progress = (station.progress || 0) + 0.08; // Adjust the increment for smoother progress
            
            if (station.progressBar) {
                station.progressBar.setFrame(Math.floor((station.progress || 0) / 12.5));
            }

            if (station.progress >= 100) {
                station.inUse = false;
                station.progress = 0;
                station.progressBar?.setVisible(false);
                
                // Update ingredient state based on station type
                if (station.currentIngredient) {
                    station.ingredientState = station.type === 'stove' ? 'cooked' : 'chopped';
                    const newFrame = this.getIngredientFrame(station.ingredientType!, station.ingredientState);
                    station.currentIngredient.setFrame(newFrame);
                }
            }
        }
    }

    private getIngredientFrame(type: string, state: 'raw' | 'chopped' | 'cooked'): number {
        const ingredients = ['onion', 'tomato', 'carrot', 'potato', 'salmon'];
        const baseIndex = ingredients.indexOf(type);
        
        if (baseIndex === -1) return 0;
        
        // Raw ingredients are frames 0-4
        // Chopped ingredients are frames 5-9 in same order
        return state === 'chopped' ? baseIndex + 5 : baseIndex;
    }
}