import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import supabase from "../../SupabaseClient";
import './SaveMenu.css'
import { sign } from "jws"
import { getUser } from "@account-kit/core"
import { config as accountKitConfig } from "../../accountKitConfig";
// import { SupabaseClient } from "@supabase/supabase-js";

export class SaveMenu extends Scene {
    saves: any[]
    list: HTMLUListElement

    constructor() {
        super('SaveMenu');
    }

    create() {
        try {
            const container = document.createElement('div');
            const ul = document.createElement('ul');
            this.list = ul;
            container.appendChild(ul);

            const domElement = this.add.dom(480, 480, container, 'background-color: #c4c4c4; cursor: pointer; user-select: none;');

            this.getSaves().then((data) => {
                data.forEach((_save, i) => {
                    const saveElement = document.createElement('li');
                    const text = `Save-${++i}`
                    saveElement.innerText = text
                    saveElement.className = 'pr-20px'

                    saveElement.onpointerdown = (_e) => {
                        this.changeScene(_save.player_data.scene_key);
                    }
                    ul.appendChild(saveElement);
                });
            }).finally(() => {
                EventBus.emit('current-scene-ready', this);
            });
        }
        catch(err) {
            console.error(err);
        }
    }

    changeScene(key = 'Overworld') {

        this.scene.start(key);
    }

    private async getSaves() {
        const user= getUser(accountKitConfig);

        const now = Math.floor(Date.now() / 1000)

        const token = sign({ payload: {
            sub: user?.userId,
            iat: now,
            exp: now + 3600
          }, secret: import.meta.env["VITE_JWT_SECRET"], header: {
            alg: "HS256", typ: "JWT"
          }});

        const headers = { "Authorization": `Bearer ${token}` };

        const { data, error } = await supabase({ headers })
            .from("game_saves")
            .select(`
                *,
                identities(user_id)
            `).eq("identities.user_id", user?.userId);

        if(error) throw error

        return data
    }
}