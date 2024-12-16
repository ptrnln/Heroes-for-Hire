import { Scene } from "phaser";

export class PauseMenu extends Scene {
    constructor() {
        super('PauseMenu');
    }

    create() {
        // Add a semi-transparent background
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.5);

        // Add a "Paused" text
        this.add.text(400, 200, 'Paused', { fontSize: '48px', color: '#ffffff' }).setOrigin(0.5);

        // Add a "Resume" button
        const resumeButton = this.add.text(400, 300, 'Resume', { fontSize: '32px', color: '#ffffff' })
            .setOrigin(0.5)
            .setInteractive();

        resumeButton.on('pointerdown', () => {
            this.scene.resume('CookingMiniGame');
            this.scene.stop();
        });

        // Add a "Quit" button
        const quitButton = this.add.text(400, 400, 'Quit', { fontSize: '32px', color: '#ffffff' })
            .setOrigin(0.5)
            .setInteractive();

        quitButton.on('pointerdown', () => {
            this.scene.stop('CookingMiniGame');
            this.scene.start('MainMenu'); // Assuming you have a MainMenu scene
        });
    }
} 