import { GameObjects, Scene } from "phaser";
import { EventBus } from "../EventBus";
import { MenuOption } from "../types/MenuOption";
import supabase from "../../SupabaseClient";
import { PostgrestError } from "@supabase/supabase-js";


export class SaveMenu extends Scene {
    saves: any[] | PostgrestError

    constructor() {
        super('SaveMenu');
        this.getSaves().then((data) => {
            this.saves = data
        })
    }

    create() {
        const save1 = new MenuOption(this, 480, 520, "Save 1", {
            fontFamily: 'Arial Black', fontSize: 24, color: '#ffffff',
            stroke: '#000000', strokeThickness: 5,
            align: 'center'
        }, {
            "pointerdown": (_pointer: any, _localX: number, _localY: number, _event: Event) => {
                this.changeScene();
            }
        })
        EventBus.emit('current-scene-ready', this);
    }

    changeScene(key='Game') {
        this.scene.start(key)
    }

    private async getSaves() {
        const { data, error } = await supabase.from("game_saves").select()

        return error ? error : data
    }
}