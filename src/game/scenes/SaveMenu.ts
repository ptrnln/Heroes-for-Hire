import { GameObjects, Scene } from "phaser";
import { EventBus } from "../EventBus";
import { MenuOption } from "../types/MenuOption";
import supabase from "../../SupabaseClient";


export class SaveMenu extends Scene {
    saves: any[]

    constructor() {
        super('SaveMenu');

        this.saves = [];
        
    }

    create() {
        // const save1 = new MenuOption(this, 480, 520, "Save 1", {
        //     fontFamily: 'Arial Black', fontSize: 24, color: '#ffffff',
        //     stroke: '#000000', strokeThickness: 5,
        //     align: 'center'
        // }, {
        //     "pointerdown": (_pointer: any, _localX: number, _localY: number, _event: Event) => {
        //         this.changeScene();
        //     }
        // })
        try {
            this.getSaves().finally(() => {
                const ul = document.createElement('ul');

                this.saves.forEach(save => {
                    debugger
                    const saveElement = document.createElement('li');
                    const { text } = save.text
                    saveElement.innerText = text
                    ul.appendChild(saveElement);
                })
                const container = document.createElement('div');
                container.appendChild(ul);
                this.add.dom(0, 0, container);
            });
        }
        catch(err) {
            console.error(err);
        }

        
        EventBus.emit('current-scene-ready', this);
    }

    changeScene(key='Game') {
        this.scene.start(key);
    }

    private async getSaves() {
        const { data, error } = await supabase.from("game_saves").select();

        if(error) throw error

        data.forEach((_save, i) => {
            this.saves.push(new MenuOption(this, 480, 520, `Save ${++i} - ${_save.created_at}`, 
            {
                fontFamily: 'Arial Black', fontSize: 24, color: '#ffffff',
                stroke: '#000000', strokeThickness: 5,
                align: 'center'
            }, 
            {
                "pointerdown": (_pointer: any, _localX: number, _localY: number, _event: Event) => {
                    this.changeScene();
                }
            }))
        })
    }
}