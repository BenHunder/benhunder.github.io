import { loadImage } from './loaders.js';
import { loadFont } from './loaders.js';
import Cell from './classes/Cell.js';
import CellMap from './classes/CellMap.js'
import { Vec2 } from './math.js';
import Layer from './classes/Layer.js';
import Font from './classes/Font.js';
import Dashboard from './classes/Dashboard.js'
import Menu from './classes/Menu.js';

// var gameCanvas = document.getElementById('gameCanvas');
// const gameWidth = gameCanvas.width;
// const gameHeight = gameCanvas.height;
const gameWidth = 640;
const gameHeight = 360;

//not used anymore
export function createBackgroundLayer(){
    const buffer = document.createElement('canvas');
    buffer.width = gameWidth;
    buffer.height = gameHeight;

    loadImage('/assets/img/game-layout2.png').then(img => {
        buffer.getContext('2d').drawImage(img, 0, 0);
        //console.log(buffer.src);
        return function drawBackgroundLayer(context) {
            context.drawImage(buffer, 0, 0);
        }
    });
}

//right now this functinon is not asynchronous, but it probably will be because icons and other images will be added
export function createDashboardLayer(font, player, game){
 
    return new Dashboard(5, font, player, game);
}

//right now this functinon is not asynchronous, but it probably will be because icons and other images will be added
export function createStartMenu(font, fontLarge){
    const buffer = document.createElement('canvas');
    buffer.width = gameWidth;
    buffer.height = gameHeight;

    return loadImage('/assets/img/ui/PauseScreenMockUp.png').then(img => {
        let options = [
            {
                'label': 'start'
            },
            {
                'label': 'settings'
            }
        ]
        return new Menu(font, fontLarge, 'GAME TITLE', options);
    });
}

export function createLevelMenu(font, fontLarge){
    const buffer = document.createElement('canvas');
    buffer.width = gameWidth;
    buffer.height = gameHeight;

    return loadImage('/assets/img/ui/PauseScreenMockUp.png').then(img => {
        let options = [
            {
                'label': 'level 4'
            },
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
        return new Menu(font, fontLarge, 'SELECT LEVEL', options);
    });
}

export function createPauseMenu(font, fontLarge){
    const buffer = document.createElement('canvas');
    buffer.width = gameWidth;
    buffer.height = gameHeight;

    return loadImage('/assets/img/ui/PauseScreenMockUp.png').then(img => {
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
        return new Menu(font, fontLarge, 'PAUSED', options);
    });
}

export function createLoseMenu(font, fontLarge){
    const buffer = document.createElement('canvas');
    buffer.width = gameWidth;
    buffer.height = gameHeight;

    return loadImage('/assets/img/ui/PauseScreenMockUp.png').then(img => {
        let options = [
            {
                'label': 'restart'
            },
            {
                'label': 'quit'
            }
        ]
        return new Menu(font, fontLarge, 'YOU LOSE', options);
    });
}

export function createWinMenu(font, fontLarge){
    const buffer = document.createElement('canvas');
    buffer.width = gameWidth;
    buffer.height = gameHeight;

    return loadImage('/assets/img/ui/PauseScreenMockUp.png').then(img => {
        let options = [
            {
                'label': 'next'
            },
            {
                'label': 'restart'
            }
        ]
        return new Menu(font, fontLarge, 'YOU WIN', options);
    });
}

export function createCell(name, coordinates, center){
    return loadImage('/assets/img/background/' + name.toUpperCase() + '.png').then(img => {
        const buffer = document.createElement('canvas');
        buffer.width = gameWidth;
        buffer.height = gameHeight;
        buffer.getContext('2d').drawImage(img, 0, 0);

        return new Cell(name, coordinates, center, buffer)
    });
}

export function createAllCells(){
    return Promise.all([
        createCell('q', new Vec2(0,0), new Vec2(59, 155)),
        createCell('w', new Vec2(1,0), new Vec2(108, 155)),
        createCell('e', new Vec2(2,0), new Vec2(156, 155)),
        createCell('r', new Vec2(3,0), new Vec2(203, 155)),
        createCell('t', new Vec2(4,0), new Vec2(250, 155)),
        createCell('y', new Vec2(5,0), new Vec2(298, 155)),
        createCell('u', new Vec2(6,0), new Vec2(343, 155)),
        createCell('i', new Vec2(7,0), new Vec2(391, 155)),
        createCell('o', new Vec2(8,0), new Vec2(438, 155)),
        createCell('p', new Vec2(9,0), new Vec2(485, 155)),
        createCell('[', new Vec2(10,0), new Vec2(532, 155)),
        //createCell(']', new Vec2(11,0), new Vec2(580, 155)),
        createCell('a', new Vec2(0,1), new Vec2(83, 204)),
        createCell('s', new Vec2(1,1), new Vec2(131, 204)),
        createCell('d', new Vec2(2,1), new Vec2(179, 204)),
        createCell('f', new Vec2(3,1), new Vec2(226, 204)),
        createCell('g', new Vec2(4,1), new Vec2(274, 204)),
        createCell('h', new Vec2(5,1), new Vec2(320, 204)),
        createCell('j', new Vec2(6,1), new Vec2(367, 204)),
        createCell('k', new Vec2(7,1), new Vec2(414, 204)),
        createCell('l', new Vec2(8,1), new Vec2(462, 204)),
        createCell(';', new Vec2(9,1), new Vec2(509, 204)),
        //createCell('\'', new Vec2(10,1), new Vec2(557, 204)),
        createCell('z', new Vec2(0,2), new Vec2(107, 252)),
        createCell('x', new Vec2(1,2), new Vec2(154, 252)),
        createCell('c', new Vec2(2,2), new Vec2(201, 252)),
        createCell('v', new Vec2(3,2), new Vec2(249, 252)),
        createCell('b', new Vec2(4,2), new Vec2(296, 252)),
        createCell('n', new Vec2(5,2), new Vec2(343, 252)),
        createCell('m', new Vec2(6,2), new Vec2(391, 252)),
        createCell(',', new Vec2(7,2), new Vec2(438, 252)),
        createCell('.', new Vec2(8,2), new Vec2(486, 252)),
        //createCell('/', new Vec2(9,2), new Vec2(533, 252)),

    //]).then(([q,w,e,r,t,y,u,i,o,p,a,s,d,f,g,h,j,k,l,z,x,c,v,b,n,m]) => {
    ]).then((cells) => {
        const cellMap = new CellMap(11,3);
        cells.forEach(cell => {
            cellMap.set(cell.name, cell.coordinates, cell);
        })

        return cellMap
    });
}

function createLayer(zIndex, cells){
    //zIndex++;
    return loadImage('/assets/img/background/Layer' + zIndex + '.png').then(img => {
        const buffer = document.createElement('canvas');
        buffer.width = gameWidth;
        buffer.height = gameHeight;
        buffer.getContext('2d').drawImage(img, 0, 0, gameWidth, gameHeight);

        return new Layer(zIndex, buffer, cells);
    });
}

export function createLayer1(cellMap){
    return createLayer('1', [
        cellMap.get('q'),
        cellMap.get('w'),
        cellMap.get('e'),
        cellMap.get('r'),
        cellMap.get('t'),
        cellMap.get('y'),
        cellMap.get('u'),
        cellMap.get('i'),
        cellMap.get('o'),
        cellMap.get('p'),
        cellMap.get('['),
        //cellMap.get(']')

        ])
    .then(layer => {
        return layer;
    });
}

export function createLayer2(cellMap){
    return createLayer('2', [
        cellMap.get('a'),
        cellMap.get('s'),
        cellMap.get('d'),
        cellMap.get('f'),
        cellMap.get('g'),
        cellMap.get('h'),
        cellMap.get('j'),
        cellMap.get('k'),
        cellMap.get('l'),
        cellMap.get(';'),
        //cellMap.get('\'')
        ])
    .then(layer => {
        return layer;
    });
}

export function createLayer3(cellMap){
    return createLayer('3', [
        cellMap.get('z'),
        cellMap.get('x'),
        cellMap.get('c'),
        cellMap.get('v'),
        cellMap.get('b'),
        cellMap.get('n'),
        cellMap.get('m'),
        cellMap.get('\,'),
        cellMap.get('.'),
        //cellMap.get('/')
        ])
    .then(layer => {
        return layer;
    });
}

export function createLayer4(){
    return createLayer('4', null).then(layer => {
        return layer;
    });
}

export function createLayer5(){
    return createLayer('5', null).then(layer => {
        return layer;
    });
}
