import Compositor from './classes/Compositor.js';
import {loadLevel, loadSounds, loadFont} from './loaders.js';
import {createLayer1, createLayer2, createLayer3, createLayer4, createLayer5, createAllCells, createDashboardLayer, createStartMenu, createLevelMenu, createPauseMenu, createLoseMenu, createWinMenu} from './layers.js';
import Timer from './classes/Timer.js';
import Controller from "./classes/Controller.js";
import Cell from './classes/Cell.js';
import Player from './classes/Player.js';
import Weapon from './classes/Weapon.js';
import Food from './classes/Food.js';
import Game from './classes/Game.js';

 
let log = console.log;
const canvas = document.getElementById('gameCanvas').getContext('2d');

//shows the mouse coordinates in chrome
document.onmousemove = function(e){
    var x = e.pageX;
    var y = e.pageY;
    e.target.title = "X is "+x+" and Y is "+y;
};

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
        gameContainer.style.height = newHeight + 'px';
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

export let cellMap;
let spawnerSet;

export let globalSoundBoard;

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
        "location": "/assets/sfx/sfx3.wav", 
        "name": "feed"
    }
];

const fontData = [
    {
        'name': 'manaspace',
        'location': '../assets/img/fonts/manaspace/manaspace.png',
        'charWidth': 16,
        'charHeight': 24
    },
    {
        'name': 'manaspace-large',
        'location': '../assets/img/fonts/manaspace/manaspace-large.png',
        'charWidth': 24,
        'charHeight': 36
    },
    {
        'name': 'lunchtime',
        'location': '../assets/img/fonts/lunchtime/lunchtime.png',
        'charWidth': 18,
        'charHeight': 32
    }
]

let player1;
let game;
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
    cellMap = await createAllCells();
    const font = await loadFont(fontData[0]);
    const fontLarge = await loadFont(fontData[1]);

    initializePlayer();
    initializeGame();

    return Promise.all([
        //loadJson('/assets/levels/testSpawnerObject.json'),
        loadSounds(soundNames),
        createLayer1(cellMap),
        createLayer2(cellMap),
        createLayer3(cellMap),
        createLayer4(),
        createLayer5(),
        createDashboardLayer(font, player1, game),
        createStartMenu(font, fontLarge),
        createLevelMenu(font, fontLarge),
        createPauseMenu(font, fontLarge),
        createLoseMenu(font, fontLarge),
        createWinMenu(font, fontLarge)
    ])
    .then(([sndBrd, layer1, layer2, layer3, layer4, layer5, dashboardLayer, sMenu, vMenu, pMenu, lMenu, wMenu]) => {
        globalSoundBoard = sndBrd;

        const comp = new Compositor();
        
        comp.layers.push(layer1);
        comp.layers.push(layer2);
        comp.layers.push(layer3);
        comp.layers.push(layer4);
        comp.layers.push(layer5);
        comp.layers.push(dashboardLayer);
        console.log({comp})
        startMenu = sMenu;
        levelMenu = vMenu;
        pauseMenu = pMenu;
        loseMenu = lMenu;
        winMenu = wMenu;
        comp.setMenu(startMenu);
    
        const input = new Controller();

        // spacebar switches weapon and food and vice versa
        //TODO make setMapping take a character instead of the keycode
        input.setMapping(32, keyState => {
            if(keyState){
                toggleWeapon();
            }
        });

        // enter pauses and selects pauseMenu options
        input.setMapping(13, keyState => {
            if(keyState){
                if(paused){
                    let action = comp.menu.selectedOption();
                    if(action === "resume"){
                        unpause();
                    }else if(action === "start"){
                        comp.setMenu(levelMenu);
                    }else if(action === "restart"){
                        resetLevel();
                        paused = false;
                    }else if(action === "quit"){
                        resetLevel();
                        comp.setMenu(startMenu)
                    }else if(action.substring(0, 5) === "level"){
                        resetLevel();
                        loadLevel(cellMap, action).then(spawners => {
                            spawnerSet = spawners;
                            unpause();
                        });
                        
                    }
                }else{
                    comp.setMenu(pauseMenu);
                    pause();
                }
            }
        });

        input.setMapping(40, keyState => {
            if(keyState){
                if(paused){
                    comp.menu.scrollDown();
                }
            }
        });

        input.setMapping(38, keyState => {
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
        const letters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','[',';','\,','.'];
        const keyCodes = [65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,219,186,188,190];
        
        letters.forEach((key, n) => {
            const cell = cellMap.get(key);
            input.setMapping(keyCodes[n], keyState => {
                if(keyState){
                    if(!paused){
                        cell.interact(onWeapon ? player1.weapon : player1.food, player1);
                    }
                }else{
                    cell.released();
                }
            });
        });
        input.listenTo(window);

        log("cellMap initialized:\n", {cellMap});
        return comp;
    });
}



function start(comp){

    const timer = new Timer(1/60);
    timer.update = function update(deltaTime){
        if(!paused){
            spawnerSet.forEach( spawner => spawner.update(deltaTime));
            comp.update(deltaTime);
            comp.draw(canvas);

            if(player1.health <= 0 || game.timer <= 0){
                comp.menu = loseMenu;
                pause();
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
    game = new Game();

}

function resetLevel(){
    cellMap.allCells().forEach(([name, cell]) => {
        cell.reset();
    });

    player1.reset();
    game.reset();
}



