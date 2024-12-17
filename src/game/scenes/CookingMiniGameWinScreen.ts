import { Scene } from "phaser";
import { TreasureChestABI } from "../../abi/TreasureChest";



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