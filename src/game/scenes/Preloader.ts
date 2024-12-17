import { Scene } from 'phaser';
// import { PhaserGame } from '../PhaserGame';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        // Load the assets for the game
        this.load.setPath('assets');

        // Add a loading text
        const loadingText = this.add.text(512, 360, 'Loading...', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.load.font('DePixel-bold', 'fonts/depixelhalbfett-webfont.woff', 'woff');
        
        // Add any other assets that MainMenu needs
        this.load.image('background', 'bg.png');  // Reload to ensure it's available
        this.load.image('logo', 'logo.png');      // Reload to ensure it's available

        // Load character spritesheets with correct dimensions
        this.load.spritesheet('player-walking-down', 'Protag1_FighterWalkingDown.png', {
            frameWidth: 261,
            frameHeight: 540
        });
        this.load.spritesheet('player-walking-left', 'Protag1_FighterWalkingLeft.png', {
            frameWidth: 270,
            frameHeight: 540
        });
        this.load.spritesheet('player-walking-up', 'Protag1_FighterWalkingUp.png', {
            frameWidth: 261,
            frameHeight: 540
        });

        this.load.spritesheet('player-carrying-down', 'Protag1_FighterCarryingDown.png', {
            frameWidth: 261,
            frameHeight: 540
        });

        this.load.spritesheet('player-carrying-left', 'Protag1_FighterCarryingLeft.png', {
            frameWidth: 270,
            frameHeight: 540
        });

        // this.load.spritesheet('player-carrying-up', 'Protag1_FighterCarryingUp.png', {
        //     frameWidth: 261,
        //     frameHeight: 540
        // });

        // Load ingredient spritesheet
        this.load.spritesheet('ingredients', 'ingredients.png', {
            frameWidth: 135,
            frameHeight: 135
        });

        // Load progress bar spritesheet
        this.load.spritesheet('progress_bar', 'progress_bar.png', {
            frameWidth: 180,
            frameHeight: 45
        });

        // load work station spritesheet
        this.load.spritesheet('cooking_stations', 'cooking_stations.png', {
            frameWidth: 432,
            frameHeight: 432
        });

        this.load.image('wood_floor', 'wood_floor.png');

        this.load.image('crate', 'crate.png');

        this.load.image('pot', 'pot.png');

        // Listen for the complete event
        this.load.on('complete', () => {
            loadingText.destroy();
            this.scene.start('MainMenu');
        });

    }

    create ()
    {
        // Create the animations
        this.anims.create({
            key: 'idle-down',
            frames: [{ key: 'player-walking-down', frame: 0 }],
            frameRate: 10
        });

        this.anims.create({
            key: 'walk-down',
            frames: this.anims.generateFrameNumbers('player-walking-down', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'idle-up',
            frames: [{ key: 'player-walking-up', frame: 0 }],
            frameRate: 10
        });

        this.anims.create({
            key: 'walk-up',
            frames: this.anims.generateFrameNumbers('player-walking-up', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'idle-left',
            frames: [{ key: 'player-walking-left', frame: 0 }],
            frameRate: 10
        });

        this.anims.create({
            key: 'walk-left',
            frames: this.anims.generateFrameNumbers('player-walking-left', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'idle-carry-down',
            frames: [{ key: 'player-carrying-down', frame: 0 }],
            frameRate: 10
        });

        this.anims.create({
            key: 'idle-carry-left',
            frames: [{ key: 'player-carrying-left', frame: 0 }],
            frameRate: 10
        });

        // this.anims.create({
        //     key: 'idle-carrying-up',
        //     frames: [{ key: 'player-carrying-up', frame: 0 }],
        //     frameRate: 10
        // });

        // this.anims.create({
        //     key: 'walk-carrying-up',
        //     frames: this.anims.generateFrameNumbers('player-carrying-up', { start: 0, end: 3 }),
        //     frameRate: 10,
        //     repeat: -1
        // });

        this.anims.create({
            key: 'walk-carry-left',
            frames: this.anims.generateFrameNumbers('player-carrying-left', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'walk-carry-down',
            frames: this.anims.generateFrameNumbers('player-carrying-down', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'stove-burning',
            frames: this.anims.generateFrameNumbers('cooking_stations', { start: 2, end: 3 }),
            frameRate: 2,
            repeat: -1
        });

        // Remove the automatic scene transition
        // this.scene.start('MainMenu');  // Remove this line
    }
}
