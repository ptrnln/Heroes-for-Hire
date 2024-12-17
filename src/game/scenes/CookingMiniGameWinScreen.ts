import { Scene } from "phaser";

export class CookingMiniGameWinScreen extends Scene {
    constructor() {
        super({ key: 'CookingMiniGameWinScreen' });
    }

    create() {
        this.add.rectangle(1024 / 2, 768 / 2, 1024, 768, 0x000000, 0.5);
        this.add.text(1024 / 2, 768 / 2, 'You Win!', { fontSize: '48px', color: '#ffffff' }).setOrigin(0.5);

        this.add.text(1024 / 2, 768 / 2 + 100, 'Mint your TresureChest NFT here:', { fontSize: '32px', color: '#ffffff' }).setOrigin(0.5);

        const mintButton = this.add.text(1024 / 2, 768 / 2 + 200, 'Mint', { fontSize: '32px', color: '#ffffff' })
            .setOrigin(0.5)
            .setInteractive();

        mintButton.on('pointerdown', () => {
            
        });
    }
}