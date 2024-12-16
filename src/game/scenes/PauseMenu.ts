import { Scene } from "phaser";
import { recipes } from "./Recipes";

export class PauseMenu extends Scene {
    constructor() {
        super('PauseMenu');
    }

    create() {
        // Add a semi-transparent background
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.5);

        // Add a "Paused" text
        this.add.text(400, 150, 'Paused', { fontSize: '48px', color: '#ffffff' }).setOrigin(0.5);

        // Add a "Resume" button
        const resumeButton = this.add.text(400, 250, 'Resume', { fontSize: '32px', color: '#ffffff' })
            .setOrigin(0.5)
            .setInteractive();

        resumeButton.on('pointerdown', () => {
            this.scene.resume('CookingMiniGame');
            this.scene.stop();
        });

        // Add a "Quit" button
        const quitButton = this.add.text(400, 350, 'Quit', { fontSize: '32px', color: '#ffffff' })
            .setOrigin(0.5)
            .setInteractive();

        quitButton.on('pointerdown', () => {
            this.scene.stop('CookingMiniGame');
            this.scene.start('MainMenu'); // Assuming you have a MainMenu scene
        });

        // Add a "Recipes" button
        const recipesButton = this.add.text(400, 450, 'Recipes', { fontSize: '32px', color: '#ffffff' })
            .setOrigin(0.5)
            .setInteractive();

        recipesButton.on('pointerdown', () => {
            this.showRecipes();
        });
    }

    private showRecipes() {
        // Clear existing content
        this.children.removeAll();

        // Add a semi-transparent background
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.5);

        // Add a "Recipes" text
        this.add.text(400, 100, 'Recipes', { fontSize: '48px', color: '#ffffff' }).setOrigin(0.5);

        // Display each recipe
        recipes.forEach((recipe, index) => {
            this.add.text(400, 200 + index * 100, recipe.name, { fontSize: '32px', color: '#ffffff' }).setOrigin(0.5);

            recipe.ingredients.forEach((ingredient, i) => {
                this.add.text(400, 240 + index * 100 + i * 20, `${ingredient.quantity}x ${ingredient.state} ${ingredient.type}`, { fontSize: '24px', color: '#ffffff' }).setOrigin(0.5);
            });
        });

        // Add a "Back" button
        const backButton = this.add.text(400, 550, 'Back', { fontSize: '32px', color: '#ffffff' })
            .setOrigin(0.5)
            .setInteractive();

        backButton.on('pointerdown', () => {
            this.scene.restart();
        });
    }
} 