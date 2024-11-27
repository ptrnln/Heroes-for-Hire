import { GameObjects, Scene } from "phaser";


export class SaveMenu extends Scene {

    constructor() {
        super('SaveMenu');
    }

    create() {
        this.add.text(480, 520, "Save 1", {
            fontFamily: 'Arial Black', fontSize: 24, color: '#ffffff',
            stroke: '#000000', strokeThickness: 5,
            align: 'center'
        })
    }
}