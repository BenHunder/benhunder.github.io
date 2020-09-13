import Trait from './Trait.js';
import {globalSoundBoard} from '../../main.js';
import {player1} from '../../main.js';
import {currentLevel} from '../../main.js';

export default class Hit extends Trait {
    constructor(creature, trait){
        super('hit');

        //TODO this is a circular reference, should fix and make traits make more sense
        this.creature = creature;
        this.rate = trait.rate;
        this.damage = trait.damage;
        this.offset = trait.animationOffset;

        this.animationFired = false;
        this.counter = 0;
    }

    start(){
        player1.damage(this.damage);
        // const target = currentLevel.cellMap.randomAdjacentPlant(this.creature.currentCell);
        // if(target){
        //     target.attack.start2(this.damage);
        // }
    }

    //update fires an animation offset seconds before it triggers its start functionality. animationFired ensures the animation won't finish and start again until start has completed.
    update(deltaTime){
        if(!this.creature.isHeld){
            this.counter += deltaTime;
            if(this.counter >= this.rate){
                this.start();
                this.counter = 0;
                this.animationFired = false;
            }else if(!this.creature.isAnimating && !this.animationFired && (this.counter >= (this.rate - this.offset))){
                this.creature.isAnimating = true;
                this.animationFired = true;
            }
        }
    }
}