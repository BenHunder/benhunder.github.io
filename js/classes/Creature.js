import { globalSoundBoard, spriteSheetMap } from '../main.js';
import { currentLevel } from '../../../js/main.js';

export default class Creature{
    constructor(name, isMaster = false){

        this.isAnimating = true;
        this.currentAnimation = 'idle';
        this.animationCycles = 0;
        this.currentFrame = 0;

        this.currentCell = null;
        this.counter = 0;
        this.age = 0;
        this.evolution = 1;
        this.spawnRate = 0;
        this.isMaster = isMaster;
        this.name = name;

    }

    //this function just adds a delay so a creature will pause for a second before it sinks after being killed. this was just for the mystery box
    kill(){
        let delay = 0;
        return delay;
    }

    damage(amount){
        this.health -= amount;
        if(this.health < 0){
            this.health = 0;
        }

        return this.health
    }

    ageMe(){
        this.age += 1;
    }

    attemptFight(){
        //console.log("fight not implemented for ", this.name);
    }

    attemptPropogation(){
        const r = Math.random();
        if(r <= this.propogationRate){
            currentLevel.spawner.propogate(this);
        }
    }

    attemptEvolution(){
        //console.log("evolve not implemented for ", this.name);
    }

    update(deltaTime){
        if(this.isAnimating){
            this.counter += deltaTime;
        }
    } 

    eName(){
        return this.name + '-e' + this.evolution;
    }
    
    draw(context, x, y, animationName){
        const spriteSheet = spriteSheetMap.get(this.eName());
        const animation = animationName == 'still' ? {"start": 0, "end": 0} : spriteSheet.getAnimation(this.currentAnimation);
        let name = 'frame' + this.currentFrame;

        //advance frames
        if(this.isAnimating){
            if(this.counter >= spriteSheet.getDuration(name)/1000){
                this.counter = 0;
                this.currentFrame += 1;

                //animation cycle complete
                if(this.currentFrame > animation.end){
                    this.currentFrame = animation.start;
                    if(this.currentAnimation != 'idle'){
                        this.animationCycles -= 1;
                        
                        //change animation back to idle if it has completed all cycles
                        if(this.animationCycles <= 0){
                            this.playAnimation('idle', 1)
                        }
                    }
                }
            }
        }else{
            this.counter = 0;
        }

        name = 'frame' + this.currentFrame;
        const buffer = spriteSheet.getBuffer(name);
        context.drawImage(buffer, x, y);
    }

    playAnimation(name, cycles){
        this.currentAnimation = name;

        //just to get animation start frame
        const spriteSheet = spriteSheetMap.get(this.eName());
        const animation = name == 'still' ? {"start": 0, "end": 0} : spriteSheet.getAnimation(this.currentAnimation);

        this.currentFrame = animation.start;
        this.animationCycles = cycles;
    }
    playSound(name, delay=0){
        if(globalSoundBoard.hasSound(name)){
            globalSoundBoard.play(name, delay);
        }else{
            console.log(name + " sound missing");
        }
    }
}