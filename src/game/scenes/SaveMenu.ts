import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import supabase from "../../SupabaseClient";
import './SaveMenu.css'
// import { SupabaseClient } from "@supabase/supabase-js";

export class SaveMenu extends Scene {
    saves: any[]
    list: HTMLUListElement

    constructor() {
        super('SaveMenu');

        // try {
        //     this.getSaves().then((data) => {
        //         const ul = document.createElement('ul');

        //         data.forEach((save, i) => {
        //             const saveElement = document.createElement('li');
        //             const text = `Save-${++i}`
        //             saveElement.innerText = text
        //             saveElement.className = 'pr-20px'
        //             saveElement.onpointerdown = (e) => {
        //                 this.changeScene();
        //             }
        //             ul.appendChild(saveElement);
        //         });

        //         this.list = ul;
        //     })
        // }
        // catch(err) {
        //     console.error(err);
        // }
        
    }

    create() {
        try {
            this.getSaves().then((data) => {
                const ul = document.createElement('ul');

                data.forEach((_save, i) => {
                    const saveElement = document.createElement('li');
                    const text = `Save-${++i}`
                    saveElement.innerText = text
                    saveElement.className = 'pr-20px'
                    saveElement.onpointerdown = (_e) => {
                        this.changeScene();
                    }
                    ul.appendChild(saveElement);
                });

                this.list = ul;
            }).finally(()=> {
                const container = document.createElement('div');
                container.appendChild(this.list);

                this.add.dom(480, 480, container, 'background-color: #c4c4c4; cursor: pointer; user-select: none;');

                
                EventBus.emit('current-scene-ready', this);
            })
        }
        catch(err) {
            console.error(err);
        }
    }

    changeScene(key='Game') {
        this.scene.start(key);
    }

    private async getSaves() {
        const { data, error } = await supabase().from("game_saves").select();

        if(error) throw error

        return data
    }
}