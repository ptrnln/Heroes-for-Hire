import { GameObjects, Scene } from 'phaser';
import { MenuOption } from '../types/MenuOption';

import { EventBus } from '../EventBus';
import * as uiActions from "../../store/ui"

declare namespace globalThis {
    var sessionUser: any
    var dispatch: any
}

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
        const newGameOption = new MenuOption(this, 512, 520, "New Game", {
            fontFamily: 'Arial Black', fontSize: 24, color: '#ffffff',
            stroke: '#000000', strokeThickness: 5,
            align: 'center'
        }, {
            "pointerdown": (
                _pointer: any, _localX: number,  _localY: number, _event: Event 
            ) => {
                if(!globalThis.sessionUser) return globalThis.dispatch(uiActions.openAuthModalThunk());

                this.changeScene('Overworld')
            },
            "pointerover": (
                _pointer: any, _localX: number, _localY: number, _event: Event
            ) => {
                
            }
        })

        const continueOption = new MenuOption(this, 512, 560, "Continue", {
            fontFamily: 'Arial Black', fontSize: 24, color: '#ffffff',
            stroke: '#000000', strokeThickness: 5,
            align: 'center'
        }, {
            "pointerdown": (
                _pointer: any, _localX: number, _localY: number, _event: Event
            ) => {
                if(!globalThis.sessionUser) return globalThis.dispatch(uiActions.openAuthModalThunk()).then(() => {
                    this.changeScene('SaveMenu');
                });
                this.changeScene('SaveMenu');
            }
        })

        this.background = this.add.image(512, 384, 'background');

        this.logo = this.add.image(512, 300, 'logo').setDepth(100);

        this.title = this.add.text(512, 460, 'Main Menu', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        this.options.push(newGameOption);
        this.options.push(continueOption);

        EventBus.emit('current-scene-ready', this);
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
