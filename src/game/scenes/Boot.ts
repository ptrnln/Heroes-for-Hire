import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        // Only load the minimum required for the loading screen
        this.load.setPath('assets');
        this.load.image('background', 'bg.png');  // Just for the loading screen background
    }

    create ()
    {
        // Start the Preloader immediately
        this.scene.start('Preloader');
    }
}
