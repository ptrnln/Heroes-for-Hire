import { Boot } from './scenes/Boot';
import { GameOver } from './scenes/GameOver';
import { Game as MainGame } from './scenes/Game';
import { MainMenu } from './scenes/MainMenu';
import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/Preloader';
import { SaveMenu } from './scenes/SaveMenu';
import { OpeningScene } from './scenes/OpeningScene';
import Overworld from './scenes/Overworld';
import { CookingMiniGame } from './scenes/CookingMiniGame';
import { PauseMenu } from './scenes/PauseMenu';
import { CookingMiniGameWinScreen } from './scenes/CookingMiniGameWinScreen';
//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scene: [
        Boot,
        Preloader,
        MainMenu,
        MainGame,
        GameOver,
        SaveMenu,
        OpeningScene,
        Overworld,
        CookingMiniGame,
        PauseMenu,
        CookingMiniGameWinScreen
    ],
    dom: {
        createContainer: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    render: {
        pixelArt: true
    },
    
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;
