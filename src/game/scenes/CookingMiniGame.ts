import { Scene } from "phaser";

export default class CookingMiniGame extends Scene {

    difficulty?: number

    constructor (difficulty: number = 0) {
        super('CookingMiniGame')
        this.difficulty = difficulty
    }

    create() {
        
    }
}