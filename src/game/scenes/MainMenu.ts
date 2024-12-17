import { GameObjects, Scene } from 'phaser';
import { MenuOption } from '../types/MenuOption';

import { EventBus } from '../EventBus';
import * as uiActions from "../../store/ui"
import { ShapecraftService } from '../services/ShapecraftService';



export class MainMenu extends Scene
{
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    options: MenuOption[];
    logoTween: Phaser.Tweens.Tween | null;
    
    constructor()
    {
        super('MainMenu');
        this.options = [];
    }

    create ()
    {       
        if (!this.textures.exists('background') || !this.textures.exists('logo')) {
            this.time.delayedCall(100, () => this.create());
            return;
        }
    
        this.background = this.add.image(512, 384, 'background');
        this.logo = this.add.image(512, 300, 'logo').setDepth(100).setScale(0.8);
    
        const newGameOption = new MenuOption(this, 512, 520, "New Game", {
            fontFamily: 'DePixel-bold', fontSize: 34, color: '#ffffff',
            stroke: '#000000', strokeThickness: 5,
            align: 'center'
        }, {

            "pointerdown": async(
                _pointer: any, _localX: number,  _localY: number, _event: Event 
            ) => {
                if(!globalThis.sessionUser)  {
                    await globalThis.dispatch(uiActions.openAuthModalThunk());
                    return;
                }
                this.changeScene('CookingMiniGame');
            },
            "pointerover": (
                _pointer: any, _localX: number, _localY: number, _event: Event
            ) => {
                
            }
        })

        const continueOption = new MenuOption(this, 512, 590, "Continue", {
            fontFamily: 'DePixel-bold', fontSize: 34, color: '#ffffff',
            stroke: '#000000', strokeThickness: 5,
            align: 'center'
        }, {

            "pointerdown": async (
                _pointer: any, _localX: number, _localY: number, _event: Event
            ) => {
                if(!globalThis.sessionUser)  {
                    await globalThis.dispatch(uiActions.openAuthModalThunk());
                    return;
                };

                this.changeScene('SaveMenu');
            }
        })

        this.options.push(newGameOption);
        this.options.push(continueOption);

        EventBus.emit('current-scene-ready', this);
    }

    private showKeyRequiredMessage() {
        this.add.text(512, 450, 'You need a Shapecraft Key to play!', {
            fontFamily: 'DePixel-bold',
            fontSize: 24,
            color: '#ff0000',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5);
    }

    
    
    changeScene(key: string = 'Game')
    {
        if (this.logoTween)
        {
            this.logoTween.stop();
            this.logoTween = null;
        }

        this.scene.start(key);
    }

    moveLogo (vueCallback: ({ x, y }: { x: number, y: number }) => void)
    {
        if (this.logoTween)
        {
            if (this.logoTween.isPlaying())
            {
                this.logoTween.pause();
            }
            else
            {
                this.logoTween.play();
            }
        } 
        else
        {
            this.logoTween = this.tweens.add({
                targets: this.logo,
                x: { value: 750, duration: 3000, ease: 'Back.easeInOut' },
                y: { value: 80, duration: 1500, ease: 'Sine.easeOut' },
                yoyo: true,
                repeat: -1,
                onUpdate: () => {
                    if (vueCallback)
                    {
                        vueCallback({
                            x: Math.floor(this.logo.x),
                            y: Math.floor(this.logo.y)
                        });
                    }
                }
            });
        }
    }
}
