import { GameObjects, Scene } from 'phaser';

export class MenuOption {
    
    index: number;
    text: GameObjects.Text;
    inputEvents: {[key: string]:  Function}
    selected: boolean

    constructor(
        scene: Scene, x: number, y: number, text: string | string[], 
        style: object, inputEvents: {
            [key: string]:  Function
        }
    ) 
    {
        this.text = scene.add.text(x, y, text, style)
            .setOrigin(0.5).setDepth(100).setInteractive();

        Object.entries(inputEvents).forEach(([name, handler]) => {
            this.text.on(name, handler);
        });
    }
}
