import { globalSoundBoard, spriteSheetMap } from '../main.js';
import Protect from "./traits/Protect.js";
import Hit from "./traits/Hit.js";
import Mystery from "./traits/Mystery.js";
import Persist from "./traits/Persist.js";

export default class Creature{
    constructor(traits, name){
        this.scoreValue = this.type === "enemy" ? 10 : 0;
        this.traits = [];
        this.isAnimating = false;
        this.currentFrame = 0;
        this.currentCell = null;
        this.counter = 0;
        this.age = 0;
        this.evolution = 1;
        this.name = name;

        traits.forEach( trait => {
            if(trait.name === 'protect'){
                this.addTrait(new Protect(this));
            }else if(trait.name === 'hit'){
                this.addTrait(new Hit(this, trait));
            }else if(trait.name === 'mystery'){
                this.addTrait(new Mystery(this, trait));
            }else if(trait.name === 'persist'){
                this.addTrait(new Persist(this, trait));
                //turn off damage function
                this.damage = function(amount){};
            }

            //TODO eventually traits will be defined in the JSON or somehting I guess, but for now, they are just strings. This line is pretty useless rn
            //creature.addTrait(new Trait(traitName));
        });
    }

    addTrait(trait) {
        this.traits.push(trait);
        this[trait.NAME] = trait;
    }

    kill(){
        let delay = 0;
        this.traits.forEach( trait => {
            if(typeof trait.kill === 'function'){
                delay += trait.kill();
            }
        })
        return delay;
    }

    damage(amount){
        this.health -= amount;
    }

    ageMe(){
        this.age += 1
    }

    update(deltaTime){
        if(this.isAnimating){
            this.counter += deltaTime;
        }

        this.traits.forEach(trait => {
            trait.update(deltaTime);
        })
    } 
    
    draw(context, x, y){
        const eName = this.name + '-e' + this.evolution;
        const spriteSheet = spriteSheetMap.get(eName);
        let name = 'frame' + this.currentFrame;

        //advance frames
        if(this.isAnimating){
            if(this.counter >= spriteSheet.getDuration(name)/1000){
                this.counter = 0;
                this.currentFrame += 1;
                if(this.currentFrame > spriteSheet.size()-1){
                    this.currentFrame = 0;
                    this.isAnimating = false;
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