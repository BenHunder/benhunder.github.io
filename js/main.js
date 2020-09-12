import Compositor from './classes/Compositor.js';
import SoundBoard from './classes/SoundBoard.js';
import {loadLevel, loadSounds, loadFont, loadImage, loadTiles} from './loaders.js';
import { createCharacterMenu, createDashboardLayer, createStartMenu, createLevelMenu, createPauseMenu, createLoseMenu, createWinMenu} from './layers.js';
import Timer from './classes/Timer.js';
import Controller from "./classes/Controller.js";
import Cell from './classes/Cell.js';
import Player from './classes/Player.js';
import Weapon from './classes/Weapon.js';
import Game from './classes/Game.js';
import { Vec2, coordinatesToIndices } from './math.js';

 
let log = console.log;
const canvas = document.getElementById('gameCanvas').getContext('2d');

function resizeGame() {
    const gameContainer = document.getElementById('gameContainer');
    const widthToHeight = 16 / 9;
    let newWidth = window.innerWidth;
    let newHeight = window.innerHeight;
    let newWidthToHeight = newWidth / newHeight;
    
    console.log(newWidthToHeight, widthToHeight)
    if (newWidthToHeight > widthToHeight) {
        console.log({newWidth})
        console.log({newHeight})
        console.log({newWidthToHeight})
        newWidth = newHeight * widthToHeight;
        console.log("-----");
        console.log({newWidth})
        gameContainer.style.height = newHeight + 'px';
        gameContainer.style.width = newWidth + 'px';
    } else {
        newHeight = newWidth / widthToHeight;
        gameContainer.style.width = newWidth + 'px';
        gameContainer.style.height = newHeight + 'px';[]
    }
    
    //gameContainer.style.marginTop = (-newHeight / 2) + 'px';
    gameContainer.style.marginLeft = (-newWidth / 2) + 'px';
    
    const gameCanvas = document.getElementById('gameCanvas');
    gameCanvas.width = newWidth;
    gameCanvas.height = newHeight;
}

//resizeGame();
//window.addEventListener('resize', resizeGame, false);
//window.addEventListener('orientationchange', resizeGame, false);

export let globalSoundBoard = new SoundBoard(3);
export let spriteSheetMap = new Map();

//TODO probably move to another file later
const soundNames = [
    {
        "location": "/assets/sfx/sfx1.wav", 
        "name": "bonkEnemy"
    },
    {
        "location": "/assets/sfx/sfx2.wav",
        "name": "bonkOther"
    },
    {
        "name": "kill",
        "location": "/assets/sfx/sfx4.wav"
    },
    {
        "location": "/assets/sfx/sfx3.wav", 
        "name": "other"
    }
];

const fontData = [
    {
        'name': 'manaspace',
        'location': '../assets/fonts/manaspace/manaspace.png',
        'charWidth': 16,
        'charHeight': 24
    },
    {
        'name': 'manaspace-large',
        'location': '../assets/fonts/manaspace/manaspace-large.png',
        'charWidth': 24,
        'charHeight': 36
    },
    {
        'name': 'lunchtime',
        'location': '../assets/fonts/lunchtime/lunchtime.png',
        'charWidth': 18,
        'charHeight': 32
    }
]
export var currentLevel;
export var tileSheet;

export var player1;
export var game1;
let levelSelection;
let creatureMenu;
let startMenu;
let levelMenu;
let pauseMenu;
let loseMenu;
let winMenu;
let paused = true;
let pauseIndex = 0;
let onWeapon = true;
function toggleWeapon(){
    onWeapon = !onWeapon;
}

function pause(comp){
    paused = true;
    comp.paused = true;
}
function unpause(comp){
    paused = false;
    comp.paused = false;

}



async function initialize(){
    const font = await loadFont(fontData[0]);
    const fontLarge = await loadFont(fontData[1]);

    initializePlayer();
    initializeGame();

    game1.level = "characterSelection";

    return Promise.all([
        loadTiles('../assets/tiles/hex-tiles.png', '../assets/tiles/hex-tiles-data.json'),
        loadSounds(soundNames, globalSoundBoard),
        createDashboardLayer(font, player1, game1),
        createCharacterMenu(font, fontLarge),
        createStartMenu(font, fontLarge),
        createLevelMenu(font, fontLarge),
        createPauseMenu(font, fontLarge),
        createLoseMenu(font, fontLarge),
        createWinMenu(font, fontLarge),
        loadLevel(game1.level)
    ])
    .then(([tiles, sndBrd, dashboardLayer, cMenu, sMenu, vMenu, pMenu, lMenu, wMenu, csLevel]) => {

        tileSheet = tiles;
        const comp = new Compositor();

        comp.dashboard = dashboardLayer;
        console.log({comp})
        creatureMenu = cMenu;
        startMenu = sMenu;
        levelMenu = vMenu;
        pauseMenu = pMenu;
        loseMenu = lMenu;
        winMenu = wMenu;
        comp.setMenu(startMenu);

        
        currentLevel = csLevel;
        log("level initialized:\n", {currentLevel});

        comp.level = currentLevel;
    
        const controller = new Controller();

        // spacebar reloads.. maybe
        controller.setMapping(32, keyState => {
            if(keyState){
                player1.reload();
            }
        });

        // the enter key - pauses and selects pauseMenu options
        controller.setMapping(13, keyState => {
            if(keyState){
                if(paused){
                    let action = comp.menu.selectedOption();
                    if(action === "resume"){
                        resumeButton(comp);
                    }else if(action === "start"){
                        startButton(comp);
                    }else if(action === "restart"){
                        restartButton(comp);
                    }else if(action === "quit"){
                        quitButton(comp);
                    }else if(action === "next level"){
                        nextLevelButton(comp);
                    }else if(action.substring(0, 5) === "level"){
                        levelButton(comp, action);
                    }
                }else{
                    comp.setMenu(pauseMenu);
                    pause(comp);
                }
            }
        });

        // down key
        controller.setMapping(40, keyState => {
            if(keyState){
                if(paused){
                    comp.menu.scrollDown();
                }
            }
        });

        // up key
        controller.setMapping(38, keyState => {
            if(keyState){
                if(paused){
                    comp.menu.scrollUp();
                }
            }
        });

        //map each key to the corresponding cell function
        //contains ]'/
        //const letters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','[',']',';','\'','\,','.','/'];
        //const keyCodes = [65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,219,221,186,222,188,190,191];
        
        //]'/ removed
        const letters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',';','\,','PERIOD','FSLASH'];
        const keyCodes = [65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,186,188,190,191];
        
        // controller.onClick = (x, y) => {
        //     for(let i = 0; i < keyCoordinates.length; i++){
        //         const [x1, x2, y1, y2] = keyCoordinates[i];
        //         if(x >= x1 && x <= x2 && y >= y1 && y <= y2){
        //             const cell = currentLevel.cellMap.get(letters[i]);
        //             clickCell(cell);
        //             break;
        //         }
        //     }
            
        // }

        controller.onClick = (x, y) => {
            const indices = coordinatesToIndices(new Vec2(x, y));

            const cell = currentLevel.cellMap.get(indices.x + "-" + indices.y);
            if(cell){
                clickCell(cell);
            }
        }

        // letters.forEach((key, n) => {
        //     const cell = currentLevel.cellMap.get(key);
        //     controller.setMapping(keyCodes[n], keyState => {
        //         if(keyState){
        //             clickCell(cell);
        //         }else{
        //             cell.released();
        //         }
        //     });
        // });
        controller.listenTo(window);

        function clickCell(cell){
            if(!paused){
                //age all cells
                currentLevel.cellMap.occupiedCells().forEach((cell) => cell.creature.ageMe());

                //interact with cell
                const selection = cell.interact(player1.weapon, player1);

                
                //character selection interaction
                if(selection && game1.level === "characterSelection"){
                    currentLevel.spawner.creatureFactories.forEach( cf => {
                        if(cf.name === selection){
                            player1.addCreature(cf);
                        }
                    });
                    player1.alliesLeft -= 1;
                    if(player1.alliesLeft <= 0){
                        comp.setMenu(levelMenu);
                        pause(comp);
                    }else{
                        creatureMenu.setHeader("CHOOSE " + player1.alliesLeft + " ALLIES");
                    }
                }else{
                    player1.ammo -= 1;
                    if(player1.ammo == 0){
                        player1.reload()
                    }

                    //increment energy by one each turn
                    player1.addEnergy();
                }
            }
        }

        return comp;
    });
}



function start(comp){

    const timer = new Timer(1/60);
    timer.update = function update(deltaTime){
        if(!paused){
            // time based version of game
            //spawn creatures
            // if(game1.level > 0){
                
            //     currentLevel.spawner.update(deltaTime);
            // }

            //update layers and cells
            comp.update(deltaTime);

            //update creatures
            if(currentLevel){
                const creatureCells = currentLevel.cellMap.occupiedCells();
                creatureCells.forEach( (cell) => {
                    if(!cell.duringSinkingAnimation){
                        cell.creature.update(deltaTime);
                    }
                });
            }

            //check win/lose conditions
            if(game1.level > 0){
                const outpostsUnderSiege = []
                currentLevel.cellMap.findOutposts().forEach(outpost => {
                    //if it can find an enemy target adjacent to it, that means it is under siege and you lose
                    if(currentLevel.cellMap.randomAdjacentTarget(outpost)){
                        outpostsUnderSiege.push(outpost);
                    }
                });
                if(currentLevel.cellMap.numEnemies() == 0){
                    win(comp);
                }else if(outpostsUnderSiege.length > 0){
                    lose(comp);
                }
            }

            //draw everything
            comp.draw(canvas);

            if(comp.menu === creatureMenu){
                comp.drawMenu(canvas);
            }

            
        }else{
            comp.draw(canvas);
            comp.drawMenu(canvas);
        }
    }
    
    timer.start();
}

initialize().then((comp) => start(comp));

function win(comp){
    comp.setMenu(winMenu);
    pause(comp);
}

function lose(comp){
    comp.setMenu(loseMenu);
    pause(comp);
}

function initializePlayer(){
    player1 = new Player();
    const basicWeapon = new Weapon("basicWeapon", 10);
    player1.weapon = basicWeapon;
}

function initializeGame(){
    game1 = new Game();

}

function resetLevel(){
    currentLevel.cellMap.allCells().forEach((cell) => {
        cell.reset();
    });
    game1.reset();
    player1.reset();
}

function initializeLevel(){
    resetLevel();
    currentLevel.spawner.initialSpawn();
}

function resumeButton(comp){
    if(game1.level === "characterSelection"){
        comp.setMenu(creatureMenu);
    }
    unpause(comp);
}

function startButton(comp){
    creatureMenu.setHeader("CHOOSE " + player1.alliesLeft + " ALLIES");
    comp.setMenu(creatureMenu);
    unpause(comp);
    currentLevel.spawner.spawnSelections();
}

function restartButton(comp){
    initializeLevel();
    unpause(comp);
}

function quitButton(comp){
    game1.level = 0;
    comp.setMenu(startMenu);
}

function nextLevelButton(comp){
    const nextLevel = (parseInt(game1.level, 10) + 1)
    game1.level = nextLevel;
    loadLevel(game1.level).then(level => {
        comp.level = level;
        currentLevel = level;
        initializeLevel();
        unpause(comp);
    });
}

function levelButton(comp, action){
    if(game1.level == "characterSelection"){
        currentLevel.spawner.creatureFactories = [];
    }
    game1.level = action.substring(6, 7);
    loadLevel(game1.level).then(level => {
        currentLevel = level;
        comp.level = level;
        initializeLevel();
        unpause(comp);
    });
}






