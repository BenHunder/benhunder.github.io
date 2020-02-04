import SpriteSheet from './classes/SpriteSheet.js';
import SoundBoard from './classes/SoundBoard.js';
import { CreatureFactory } from './classes/CreatureFactory.js';
import { Spawner } from './classes/Spawner.js';
import Font from './classes/Font.js';


//TODO probably move or REMOVE later (maybe make all creature's file name their type.json, maybe keep it this way to use different character versions or something?)
const creatureLocations = {
    "mushboy": "./assets/characters/mushboy.json",
    "bunbun": "./assets/characters/bunbun.json",
    "protector": "./assets/characters/protector.json",
    "plant": "./assets/characters/plant.json"
}

const levelLocations = {
    "level 1": "./assets/levels/testLevel1.json",
    "level 2": "./assets/levels/testLevel2.json",
    "level 3": "./assets/levels/testLevel3.json",
    "level 4": "./assets/levels/testLevel4.json"
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
export function loadFrames(spriteSheetLocation, frameDataLocation){

    return Promise.all([
        loadImage(spriteSheetLocation),
        loadJson(frameDataLocation)
    ])
    .then(([image, frameData]) => {
        const sprites = new SpriteSheet(image);
        const frameNames = Object.keys(frameData.frames);
        frameNames.forEach( (frameName, n) => {
            const frame = frameData.frames[frameName].frame;
            sprites.define('frame' + n, frame.x, frame.y, frame.w, frame.h);
            //console.log(sprites.getBuffer(n));
        });
        return sprites;
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
export async function loadSounds(soundNames){
    //this is the number of audio elements that will be created for each sound. the higher n, the greater the polyphony, the greater the load time
    const n = 3;

    let soundNamesTimesN = [];

    soundNames.forEach(soundName => {
        for(let i=0; i<n; i++){
            soundNamesTimesN.push(soundName);
        }
    })
    
    const soundBoard = new SoundBoard(n);

    const promisesArray = soundNamesTimesN.map(soundName => {
        return loadSound(soundName.location)
        .then(audio => {
            soundBoard.define(soundName.name, audio);
            return audio;
        });
    });

    const resolvedPromises = await Promise.all(promisesArray);
    return soundBoard;
}

//loads level json, makes creature factories, returns and array of spawners 
export function loadLevel(cellMap, levelName){
    return loadJson(levelLocations[levelName])
    .then( level => {
        let promisesArray = [];
        level.spawners.forEach( spawner => {
            promisesArray.push( 
                loadCreature(spawner.type)
                .then( creatureFactory => {
                    const newSpawner = new Spawner(cellMap, creatureFactory, spawner.spawnRate, spawner.spawnVariance, spawner.spawnCluster);
                    return newSpawner;
                })
            );
        });

        return Promise.all(promisesArray);
    });
}

//load all character properties (sounds, frames, attributes)
export function loadCreature(creatureName){
    return loadJson(creatureLocations[creatureName])
    .then( creature => {
        return Promise.all([
            loadFrames(creature.spriteSheetLocation, creature.frameDataLocation),
            loadSounds(creature.sounds)
        ])
        .then( ([spriteSheet, soundBoard]) => {
            return new CreatureFactory(spriteSheet, soundBoard, creature.name, creature.width, creature.height, creature.attributes);
        });
    });
}

