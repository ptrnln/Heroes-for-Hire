import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import useSupabase  from "../../SupabaseClient";
import './SaveMenu.css'
import { sign } from "jws"
import { getUser } from "@account-kit/core"
import { config as accountKitConfig } from "../../accountKitConfig";
// import { SupabaseClient } from "@supabase/supabase-js";
import { PhaserGame } from "../PhaserGame";


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
            ul.style.margin = '0';
            ul.style.padding = '0';
            this.list = ul;
            container.appendChild(ul);

            const domElement = this.add.dom(+this.game.config.width / 2, +this.game.config.height / 2, container, `
                cursor: pointer; 
                user-select: none; 
                font-family: "DePixel-bold"; 
                display: flex; 
                flex-direction: column; 
                align-items: center; 
                justify-content: center;
                width: 100%;`);

            this.getSaves().then((data) => {
                data.forEach((_save, i) => {
                    const saveElement = document.createElement('li');
                    const text = `Save-${++i}`
                    saveElement.innerText = text
                    saveElement.className = 'pr-20px'

                    saveElement.style.fontSize = '20px'
                    saveElement.style.padding = '10px'
                    saveElement.style.border = '1px solid #000000'
                    saveElement.style.borderRadius = '10px'
                    saveElement.style.backgroundColor = '#ffffff'
                    saveElement.style.color = '#000000'
                    saveElement.style.cursor = 'pointer'
                    saveElement.style.userSelect = 'none'
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

        

        const now = Date.now() / 1000

        const token = sign({ payload: {
            sub: user?.userId,
            iat: now,
            exp: now + 3600
          }, secret: import.meta.env["VITE_JWT_SECRET"], header: {
            alg: "HS256", typ: "JWT"
          }});

        const signedToken = `Bearer ${token}`;

        const supabase = useSupabase();

        const { data, error } = await supabase
            .from("game_saves")
            .select(`
                *,
                identities(user_id)
            `)
            .eq("identities.user_id", user?.userId)
            .setHeader("Authorization", signedToken);

        if(error) throw error

        return data
    }
}