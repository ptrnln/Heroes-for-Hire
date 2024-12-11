import { Scene } from "phaser"
import { tileSizes, gridMap } from "./tilemaps/overworld.json"
import { EventBus } from "../EventBus";


export default class Overworld extends Scene {
    private player!: Phaser.GameObjects.Rectangle;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor () {
        super('Overworld');
    }

    create() {
        const grass = this.textures.exists("grass") ? this.textures.get("grass") : null

        // Calculate world bounds based on grid size
        const worldWidth = gridMap[0].length * tileSizes.default[0] * 0.5;
        const worldHeight = gridMap.length * tileSizes.default[1] * 0.5;
        
        // Set world bounds
        this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

        // Create grass tiles
        // for(let i = 0; i < gridMap.length; i++) {
        //     for (let j = 0; j < gridMap[i].length; j++) {
        //         this.add.sprite(
        //             (tileSizes.default[0] * (j + 1) - (tileSizes.default[0] / 2)),
        //             (tileSizes.default[1] * (i + 1) - (tileSizes.default[1] / 2)),
        //             (grass ?? ""),
        //             gridMap[i][j]
        //         ).setScale(0.5);
        //     }
        // }
        for(let i = 0; i < gridMap.length; i++) {
            for (let j = 0; j < gridMap[i].length; j++) {
                this.add.sprite(
                    j * tileSizes.default[0] * 0.5,  // Removed the +1 and division by 2
                    i * tileSizes.default[1] * 0.5,  // Removed the +1 and division by 2
                    (grass ?? ""),
                    gridMap[i][j]
                ).setScale(0.5).setOrigin(0, 0);
            }
        }
        

        // Create player
        this.player = this.add.rectangle(100, 100, 48, 48, 0xff0000);
        this.physics.add.existing(this.player);
        
        // Enable physics body and set collision with world bounds
        const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
        playerBody.setCollideWorldBounds(true);

        // Setup camera
        this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
        this.cameras.main.startFollow(this.player, true);

        // Setup keyboard input
        this.cursors = (this.input.keyboard as Phaser.Input.Keyboard.KeyboardPlugin).createCursorKeys();
        EventBus.emit('current-scene-ready', this);
    }

    preload(): any {
        this.load.spritesheet("grass", "assets/grass.png", { frameWidth: tileSizes.default[0], frameHeight: tileSizes.default[1] });
    }

    update() {
        const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
        const speed = 300;

        // Reset velocity
        playerBody.setVelocity(0);

        // Handle movement
        if (this.cursors.left.isDown) {
            playerBody.setVelocityX(-speed);
        } else if (this.cursors.right.isDown) {
            playerBody.setVelocityX(speed);
        }

        if (this.cursors.up.isDown) {
            playerBody.setVelocityY(-speed);
        } else if (this.cursors.down.isDown) {
            playerBody.setVelocityY(speed);
        }
    }
}