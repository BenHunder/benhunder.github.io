import Compositor from './classes/Compositor.js';
import SoundBoard from './classes/SoundBoard.js';
import {loadLevel, loadSounds, loadFont, loadImage} from './loaders.js';
import {createLayer1, createLayer2, createLayer3, createLayer4, createLayer5, createCharacterMenu, createAllCells, createLevelSelection, createDashboardLayer, createStartMenu, createLevelMenu, createPauseMenu, createLoseMenu, createWinMenu} from './layers.js';
import Timer from './classes/Timer.js';
import Controller from "./classes/Controller.js";
import Cell from './classes/Cell.js';
import Player from './classes/Player.js';
import Weapon from './classes/Weapon.js';
import Food from './classes/Food.js';
import Game from './classes/Game.js';

 
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
        "name": "feed"
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
export var cellMap;
export var spawner;

export var player1;
export var game1;
export var healthbar;
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
function togglePause(){
    paused = !paused;
}
function pause(){
    paused = true;
}
function unpause(){
    paused = false;
}



async function initialize(){
    levelSelection = await createLevelSelection();
    cellMap = await createAllCells();
    const font = await loadFont(fontData[0]);
    const fontLarge = await loadFont(fontData[1]);

    initializePlayer();
    initializeGame();

    return Promise.all([
        //loadJson('/assets/levels/testSpawnerObject.json'),
        loadSounds(soundNames, globalSoundBoard),
        createLayer1(cellMap),
        createLayer2(cellMap),
        createLayer3(cellMap),
        createLayer4(),
        //createLayer5(),
        loadImage('../assets/ui/healthbar.png'),
        createDashboardLayer(font, player1, game1),
        createCharacterMenu(font, fontLarge),
        createStartMenu(font, fontLarge),
        createLevelMenu(font, fontLarge),
        createPauseMenu(font, fontLarge),
        createLoseMenu(font, fontLarge),
        createWinMenu(font, fontLarge)
    ])
    .then(([sndBrd, layer1, layer2, layer3, layer4, healthbr, dashboardLayer, cMenu, sMenu, vMenu, pMenu, lMenu, wMenu]) => {

        const comp = new Compositor();
        
        comp.layers.push(layer1);
        comp.layers.push(layer2);
        comp.layers.push(layer3);
        comp.layers.push(layer4);
        //comp.layers.push(layer5);
        healthbar = healthbr;
        comp.layers.push(dashboardLayer);
        console.log({comp})
        creatureMenu = cMenu;
        startMenu = sMenu;
        levelMenu = vMenu;
        pauseMenu = pMenu;
        loseMenu = lMenu;
        winMenu = wMenu;
        comp.setMenu(startMenu);
    
        const controller = new Controller();

        // spacebar switches weapon and food and vice versa
        //TODO make setMapping take a character instead of the keycode
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
                    pause();
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
        const keyCoordinates = [    
            [ 24, 80, 178, 205 ],
            [ 261, 314, 238, 267 ],
            [ 134, 189, 238, 267 ],
            [ 145, 197, 178, 205 ], 
            [ 155, 203, 132, 154 ],
            [ 206, 256, 178, 205 ], 
            [ 266, 316, 178, 205 ], 
            [ 324, 374, 178, 205 ],
            [ 437, 485, 132, 154 ],
            [ 384, 434, 178, 205 ], 
            [ 443, 495, 178, 205 ], 
            [ 501, 554, 178, 205 ],
            [ 389, 442, 238, 267 ],
            [ 326, 379, 238, 267 ], 
            [ 492, 542, 132, 154 ], 
            [ 548, 599, 132, 154 ],
            [ 41, 92, 132, 154 ],
            [ 212, 260, 132, 154 ],
            [ 86, 139, 178, 205 ],
            [ 269, 316, 132, 154 ],
            [ 380, 428, 132, 154 ],
            [ 198, 251, 238, 267 ], 
            [ 98, 148, 132, 154 ],
            [ 71, 128, 238, 267 ], 
            [ 324, 371, 132, 154 ],
            [ 6, 65, 238, 267 ],
            [ 560, 616, 178, 205 ],
            [ 451, 506, 238, 267 ],
            [ 512, 569, 238, 267 ], 
            [ 575, 634, 238, 267 ],
        ]
        
        controller.onClick = (x, y) => {
            for(let i = 0; i < keyCoordinates.length; i++){
                const [x1, x2, y1, y2] = keyCoordinates[i];
                if(x >= x1 && x <= x2 && y >= y1 && y <= y2){
                    const cell = cellMap.get(letters[i]);
                    clickCell(cell);
                    break;
                }
            }
            
        }

        letters.forEach((key, n) => {
            const cell = cellMap.get(key);
            controller.setMapping(keyCodes[n], keyState => {
                if(keyState){
                    clickCell(cell);
                }else{
                    cell.released();
                }
            });
        });
        controller.listenTo(window);

        function clickCell(cell){
            if(!paused){
                //age all cells
                cellMap.occupiedCells().forEach(([name, cell]) => cell.creature.ageMe());

                //interact with cell
                const selection = cell.interact(onWeapon ? player1.weapon : player1.food, player1);

                
                //character selection interaction
                if(selection && game1.level === "characterSelection"){
                    spawner.creatureFactories.forEach( cf => {
                        if(cf.name === selection){
                            player1.addCreature(cf);
                        }
                    });
                    player1.alliesLeft -= 1;
                    if(player1.alliesLeft <= 0){
                        pause();
                        comp.setMenu(levelMenu);
                    }else{
                        creatureMenu.setHeader("CHOOSE " + player1.alliesLeft + " ALLIES");
                    }
                }else{
                    player1.ammo -= 1;
                    if(player1.ammo == 0){
                        player1.reload()
                    }

                    //advance ally ready counter
                    if(player1.allyReadyCounter > 0){
                        player1.allyReadyCounter -= 1;
                    }
                }
            }
        }

        log("cellMap initialized:\n", {cellMap});
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
                
            //     spawner.update(deltaTime);
            // }

            //update layers and cells
            comp.update(deltaTime);

            //update creatures
            const creatureCells = cellMap.occupiedCells();
            creatureCells.forEach( ([name, cell]) => {
                if(!cell.duringSinkingAnimation){
                    cell.creature.update(deltaTime);
                }
            });

            //check win/lose conditions
            if(game1.level > 0){
                if(player1.health <= 0){
                    comp.setMenu(loseMenu);
                    pause();
                }else if(game1.timer <= 0){
                    comp.setMenu(winMenu);
                    pause();
                }else if(cellMap.numEnemies() == 0){
                    comp.setMenu(winMenu);
                    pause();
                }
            }

            game1.letters = cellMap.enemyCells().map(([name, cell]) => name).join('');

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

function initializePlayer(){
    player1 = new Player();
    const basicWeapon = new Weapon("basicWeapon", 10);
    const basicFood = new Food('basicFood', 10);
    player1.weapon = basicWeapon;
    player1.food = basicFood;
}

function initializeGame(){
    game1 = new Game();

}

function resetLevel(){
    cellMap.allCells().forEach(([name, cell]) => {
        cell.reset();
    });
    game1.reset();
    player1.reset();
}

function initializeLevel(){
    resetLevel();
    spawner.initialSpawn();
    console.log({player1});
    console.log({spawner});
}

function resumeButton(comp){
    if(game1.level === "characterSelection"){
        comp.setMenu(creatureMenu);
    }
    unpause();
}

function startButton(comp){
    unpause();
    creatureMenu.setHeader("CHOOSE " + player1.alliesLeft + " ALLIES");
    comp.setMenu(creatureMenu);
    game1.level = "characterSelection";
    resetLevel();
    player1.clearCreatures();
    loadLevel(cellMap, game1.level).then(spwnr => {
        spawner = spwnr;
        spawner.spawnSelections();
    });
}

function restartButton(comp){
    initializeLevel();
    unpause();
}

function quitButton(comp){
    game1.level = 0;
    comp.setMenu(startMenu);
}

function nextLevelButton(comp){
    const nextLevel = (parseInt(game1.level, 10) + 1)
    game1.level = nextLevel;
    loadLevel(cellMap, game1.level).then(spwnr => {
        spawner = spwnr;
        initializeLevel();
        unpause();
    });
}

function levelButton(comp, action){
    if(game1.level == "characterSelection"){
        spawner.creatureFactories = [];
    }
    game1.level = action.substring(6, 7);
    loadLevel(cellMap, game1.level).then(spwnr => {
        spawner = spwnr;
        initializeLevel();
        unpause();
    });
}





