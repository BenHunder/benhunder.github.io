import SpriteSheet from './classes/SpriteSheet.js';
import CellMap from './classes/CellMap.js';
import { globalSoundBoard, spriteSheetMap, player1, tileSheet } from './main.js';
import { CreatureFactory } from './classes/CreatureFactory.js';
import { Spawner } from './classes/Spawner.js';
import Font from './classes/Font.js';
import Cell from './classes/Cell.js';
import Orchill from '../assets/characters/orchill/Orchill.js';
import Achilia from '../assets/characters/achilia/Achilia.js';
import Grass from '../assets/characters/grass/Grass.js';
import Mushboy from '../assets/characters/mushboy/Mushboy.js';
import Bunbun from '../../assets/characters/bunbun/Bunbun.js';
import Sprout from '../assets/characters/sprout/Sprout.js';


export const creatureTypes = {
    Achilia,
    Orchill,
    Grass,
    Sprout,
    Mushboy,
    Bunbun 
}

export function loadJson(path){
    return fetch(path)
    .then(r => {
        return r.json();
    }).then(res => {
        return res;
    })
}

export function loadImage(url){
    return new Promise(resolve => {
        const image = new Image();
        image.addEventListener("load", () => {
            resolve(image);
        });
        image.src = url;
    });
}

export function loadFont(fontData){
    return loadImage(fontData.location).then(img => {
        return new Font(img, fontData.name, fontData.charWidth, fontData.charHeight);
    });

}

//loads character sprite sheet and defines each frame
export function loadFrames(spriteSheetLocation, frameDataLocation, creatureName){

    return Promise.all([
        loadImage(spriteSheetLocation),
        loadJson(frameDataLocation)
    ])
    .then(([image, frameData]) => {
        const sprites = new SpriteSheet(image);
        const frameNames = Object.keys(frameData.frames);
        frameNames.forEach( (frameName, n) => {
            const frame = frameData.frames[frameName].frame;
            sprites.define('frame' + n, frame.x, frame.y, frame.w, frame.h, frameData.frames[frameName].duration);
        });
        spriteSheetMap.set(creatureName, sprites);
    })
}

export function loadSound(url){
    return new Promise(resolve => {
        const audio = new Audio();
        audio.addEventListener("canplaythrough", () => {
            resolve(audio);
        });
        audio.src = url;
    });
}

//puts all promises from calling loadSounds in array and resolves together.
//not sure if this makes sense to do with audio elements, but I just want this function to wait until all audio is loaded
export async function loadSounds(soundNames, soundBoard){
    //this is the number of audio elements that will be created for each sound. the higher n, the greater the polyphony, the greater the load time
    const n = soundBoard.n;

    let soundNamesTimesN = [];

    soundNames.forEach(soundName => {
        for(let i=0; i<n; i++){
            soundNamesTimesN.push(soundName);
        }
    })

    const promisesArray = soundNamesTimesN.map(soundName => {
        return loadSound(soundName.location)
        .then(audio => {
            soundBoard.define(soundName.name, audio);
            return audio;
        });
    });

    const resolvedPromises = await Promise.all(promisesArray);
}

//loads tiles image and defines each tile based on frameData json
export function loadTiles(tileImageLocation, tileDataLocation){
    console.log("loadin tiles");
    return Promise.all([
        loadImage(tileImageLocation),
        loadJson(tileDataLocation)
    ])
    .then(([image, tileData]) => {
        const tileSheet = new SpriteSheet(image);
        tileData.tiles.forEach( (tile) => {
            tileSheet.define(tile.name, tile.x, tile.y, tile.w, tile.h);
        });
        return tileSheet;
    })
}

//loads level json, makes creature factories, returns and array of spawners 
export function loadLevel(lvl){
    console.log("loadin level " + lvl);
    return loadJson("./assets/levels/" + lvl + ".json")
    .then( level => {
        const cellWidth = level.map[0].length;
        const cellHeight = level.map.length;
        const cellMap = new CellMap(cellWidth, cellHeight);

        for(let i=0; i < cellHeight; i++){
            for(let j=0; j < cellWidth; j++){
                const cell = new Cell(i + "-" + j, new Vec2(i, j), new Vec2(i*32,j*32), tileSheet.getBuffer(terrain), tileSheet.getBuffer('desert'));
                cellMap.set(cell.name, cell.coordinates, cell);
            }
        }
        const newSpawner = new Spawner(cellMap, level.spawner.spawnRate);

        let promisesArray = [];

        //load creatures in the level.json
        level.spawner.creatures.forEach( creature => {
            promisesArray.push( 
                loadCreatureType(creature.type, creature.evolutions, creature.initialChance, creature.cluster, creature.selectionCell)
                .then( creatureFactory => {
                    newSpawner.addCreature(creatureFactory);
                })
            );
        });
        return Promise.all(promisesArray).then( x => {

            //add player selections
            player1.creatureFactories.forEach( cf => {
                newSpawner.addCreature(cf);
            })
            return new Level(cellMap, newSpawner);
        });
    });
}

//load spritesheets for all evolutions of creature, then create and return a creatureFactory
export function loadCreatureType(creatureName, creatureEvolutions, creatureChance, creatureCluster, selectionCell){
    let promisesArray = [];

    //load spritesheets for each evolution of creature
    for(let i = 1; i < creatureEvolutions+1; i++) {
        const spriteSheetLocation = "/assets/characters/" + creatureName + "/" + creatureName + "-e" + i + "-sheet.png";
        const frameDataLocation = "/assets/characters/" + creatureName + "/" + creatureName + "-e" + i + ".json";

        const eName = creatureName + "-e" + i;
        promisesArray.push(
            loadFrames(spriteSheetLocation, frameDataLocation, eName)
        );
    };

    return Promise.all(promisesArray).then( () => {
        return new CreatureFactory(creatureTypes[capitalize(creatureName)], creatureChance, creatureCluster, selectionCell, creatureName);
    });
}

const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

