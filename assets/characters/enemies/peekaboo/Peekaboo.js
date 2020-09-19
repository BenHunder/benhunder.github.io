import Creature from '/js/classes/Creature.js'
import { spriteSheetMap } from '../../../../js/main.js';

export default class Peekaboo extends Creature{
    constructor(){

        super('peekaboo');
        this.height = 32;
        this.width = 32;
        this.maxHealth = 10;
        this.health = this.maxHealth;
        this.propogationRate = 0.02;
        this.alignment =  "enemy";

        this.isOpen = false;
        
    }

    damage(amount){
        if(this.isOpen){
            this.health -= amount;
            if(this.health < 0){
                this.health = 0;
            }
        }

        return this.health
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
                        this.animationCycles += 1;
                        
                        //repeat each animation 3 times
                        if(this.animationCycles > 2){
                            this.currentAnimation = 'idle'
                            this.animationCycles = 0;
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

}