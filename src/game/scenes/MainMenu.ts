import { GameObjects, Scene } from 'phaser';

import { EventBus } from '../EventBus';

class MenuOption {
    text: GameObjects.Text;
    inputEvents: Map<string, Function>;

    constructor(
        scene: Scene, x: number, y: number, text: string | string[], 
        style: object, inputEvents: {
            [key: string]: Function
        }
    ) 
    {
        this.text = scene.add.text(x, y, text, style)
            .setOrigin(0.5).setDepth(100).setInteractive();

        Object.entries(inputEvents).forEach(([name, handler]) => {
            this.text.on(name, handler);
        });
    }
}

export class MainMenu extends Scene
{
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    options: MenuOption[];
    logoTween: Phaser.Tweens.Tween | null;
    

    constructor ()
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
            "pointerdown": function (
                _pointer: any, localX: number, 
                localY: number, event: Event 
            ) 
            {
                console.log(_pointer, localX, localY, event);
            }
        })

        const ContinueOption = new MenuOption(this, 512, 560, "Continue", {
            fontFamily: 'Arial Black', fontSize: 24, color: '#ffffff',
            stroke: '#000000', strokeThickness: 5,
            align: 'center'
        }, {

        })

        this.background = this.add.image(512, 384, 'background');

        this.logo = this.add.image(512, 300, 'logo').setDepth(100);

        this.title = this.add.text(512, 460, 'Main Menu', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        this.options.push(newGameOption);
        this.options.push(ContinueOption);

        EventBus.emit('current-scene-ready', this);
    }
    
    changeScene ()
    {
        if (this.logoTween)
        {
            this.logoTween.stop();
            this.logoTween = null;
        }

        this.scene.start('Game');
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
