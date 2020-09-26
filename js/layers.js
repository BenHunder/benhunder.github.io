import { loadImage } from './loaders.js';
import Layer from './classes/Layer.js';
import Dashboard from './classes/Dashboard.js'
import Menu from './classes/Menu.js';

// var gameCanvas = document.getElementById('gameCanvas');
// const gameWidth = gameCanvas.width;
// const gameHeight = gameCanvas.height;
const gameWidth = 640;
const gameHeight = 360;

//right now this functinon is not asynchronous, but it probably will be because icons and other images will be added
export function createDashboardLayer(font, player, game){
 
    return new Dashboard(5, font, player, game);
}

//right now this functinon is not asynchronous, but it probably will be because icons and other images will be added
export function createStartMenu(font, fontLarge){
    const buffer = document.createElement('canvas');
    buffer.width = gameWidth;
    buffer.height = gameHeight;

    return loadImage('/assets/ui/PauseScreenMockUp.png').then(img => {
        let options = [
            {
                'label': 'start'
            },
            {
                'label': 'settings'
            }
        ]
        return new Menu(font, fontLarge, 'GAME TITLE', options, true);
    });
}

export function createCharacterMenu(font, fontLarge){
    const buffer = document.createElement('canvas');
    buffer.width = gameWidth;
    buffer.height = gameHeight;

    return loadImage('/assets/ui/PauseScreenMockUp.png').then(img => {
        let options = [
            
        ]
        return new Menu(font, fontLarge, 'CHOOSE YOUR ALLIES', options, false);
    });
}

export function createLevelMenu(font, fontLarge){
    const buffer = document.createElement('canvas');
    buffer.width = gameWidth;
    buffer.height = gameHeight;

    return loadImage('/assets/ui/PauseScreenMockUp.png').then(img => {
        let options = [
            {
                'label': 'level 1'
            },
            {
                'label': 'level 2'
            },
            {
                'label': 'level 3'
            },
            {
                'label': 'quit'
            }
        ]
        return new Menu(font, fontLarge, 'SELECT LEVEL', options, true);
    });
}

export function createPauseMenu(font, fontLarge){
    const buffer = document.createElement('canvas');
    buffer.width = gameWidth;
    buffer.height = gameHeight;

    return loadImage('/assets/ui/PauseScreenMockUp.png').then(img => {
        let options = [
            {
                'label': 'resume'
            },
            {
                'label': 'restart'
            },
            {
                'label': 'quit'
            }
        ]
        return new Menu(font, fontLarge, 'PAUSED', options, true);
    });
}

export function createLoseMenu(font, fontLarge){
    const buffer = document.createElement('canvas');
    buffer.width = gameWidth;
    buffer.height = gameHeight;

    return loadImage('/assets/ui/PauseScreenMockUp.png').then(img => {
        let options = [
            {
                'label': 'restart'
            },
            {
                'label': 'quit'
            }
        ]
        return new Menu(font, fontLarge, 'MISSION FAILED', options, true);
    });
}

export function createWinMenu(font, fontLarge){
    const buffer = document.createElement('canvas');
    buffer.width = gameWidth;
    buffer.height = gameHeight;

    return loadImage('/assets/ui/PauseScreenMockUp.png').then(img => {
        let options = [
            {
                'label': 'next level'
            },
            {
                'label': 'restart'
            },
            {
                'label': 'quit'
            }
        ]
        return new Menu(font, fontLarge, 'YOU WIN', options, true);
    });
}



function createLayer(zIndex, cells){
    //zIndex++;
    return loadImage('/assets/background/ortholinear-layers/Layer' + zIndex + '.png').then(img => {
        const buffer = document.createElement('canvas');
        buffer.width = gameWidth;
        buffer.height = gameHeight;
        buffer.getContext('2d').drawImage(img, 0, 0, gameWidth, gameHeight);

        return new Layer(zIndex, buffer, cells);
    });
}

