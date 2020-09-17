import { globalSoundBoard, spriteSheetMap } from '../main.js';
import Hit from "./traits/Hit.js";
import Mystery from "./traits/Mystery.js";
import { currentLevel } from '../../../js/main.js';

export default class Creature{
    constructor(traits, name, isMaster = false){
        this.scoreValue = this.alignment === "enemy" ? 10 : 0;
        this.traits = [];
        this.isAnimating = true;
        this.currentFrame = 0;
        this.currentCell = null;
        this.counter = 0;
        this.age = 0;
        this.evolution = 1;
        this.spawnRate = 0;
        this.isMaster = isMaster;
        this.name = name;

        traits.forEach( trait => {
            if(trait.name === 'hit'){
                this.addTrait(new Hit(this, trait));
            }else if(trait.name === 'mystery'){
                this.addTrait(new Mystery(this, trait));
            }

            //TODO eventually traits will be defined in the JSON or somehting I guess, but for now, they are just strings. This line is pretty useless rn
            //creature.addTrait(new Trait(traitName));
        });
    }

    addTrait(trait) {
        this.traits.push(trait);
        this[trait.NAME] = trait;
    }

    //this function just adds a delay so a creature will pause for a second before it sinks after being killed. this was just for the mystery box
    kill(){
        let delay = 0;
        this.traits.forEach( trait => {
            if(typeof trait.kill === 'function'){
                delay += trait.kill();
            }
        });
        return delay;
    }

    damage(amount){
        this.health -= amount;
        if(this.health < 0){
            this.health = 0;
        }
    }

    ageMe(){
        this.age += 1;
    }

    attemptPropogation(){
        const r = Math.random();
        if(r <= this.propogationRate){
            currentLevel.spawner.propogate(this);
        }
    }

    update(deltaTime){
        if(this.isAnimating){
            this.counter += deltaTime;
        }

        // this.traits.forEach(trait => {
        //     trait.update(deltaTime);
        // })
    } 

    eName(){
        return this.name + '-e' + this.evolution;
    }
    
    draw(context, x, y, animationName){
        const spriteSheet = spriteSheetMap.get(this.eName());
        const animation = animationName == 'still' ? {"start": 0, "end": 0} : spriteSheet.getAnimation(animationName);
        let name = 'frame' + this.currentFrame;

        //advance frames
        if(this.isAnimating){
            if(this.counter >= spriteSheet.getDuration(name)/1000){
                this.counter = 0;
                this.currentFrame += 1;
                if(this.currentFrame > animation.end){
                    this.currentFrame = animation.start;
                }
            }
        }else{
            this.counter = 0;
        }

        name = 'frame' + this.currentFrame;
        const buffer = spriteSheet.getBuffer(name);
        context.drawImage(buffer, x, y);
    }
    playSound(name, delay=0){
        if(globalSoundBoard.hasSound(name)){
            globalSoundBoard.play(name, delay);
        }else{
            console.log(name + " sound missing");
        }
    }
}