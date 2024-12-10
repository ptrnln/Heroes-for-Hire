import { Scene } from "phaser"
import tileMap from "./tilemaps/overworld.json"

export default class Overworld extends Scene {

    constructor () {
        super('Overworld');
    }

    create() {
        const grass = this.textures.exists("grass") ? this.textures.get("grass") : null

        for(let i = 0; i < tileMap.length; i++) {
            for (let j = 0; j < tileMap[i].length; j++) {
                this.add.sprite(
                    (48 * (j + 1) - 24),
                    (48 * (i + 1) - 24),
                    (grass ?? ""),
                    tileMap[i][j]
                )
            }
        }

    }

    preload(): any {
        this.load.spritesheet("grass", "assets/grass.png", { frameWidth: 48, frameHeight: 48,  });
    }
}