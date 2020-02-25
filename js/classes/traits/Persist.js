import Trait from './Trait.js';
import {globalSoundBoard} from '../../main.js';
import {player1} from '../../main.js';
import {cellMap} from '../../main.js';

export default class Persist extends Trait {
    constructor(creature, trait){
        super('persist');

        //TODO this is a circular reference, should fix and make traits make more sense
        this.creature = creature;
        this.regainRate = trait.regainRate;

        this.counter = 0;
    }

    //this is messy as hell, should clean up. make a more sensible press/release system with cells/creatures. cells should just pass the event onto the creature
    update(deltaTime){
        if(this.creature.isHeld){
            if(this.creature.health <= 0){
                this.creature.currentCell.attack.kill(player1);
            }else{
                this.creature.health -= this.regainRate * deltaTime;
            }
        }else{
            //regain health when not held
            if(this.creature.health < this.creature.maxHealth){
                this.creature.health += this.regainRate * 2 * deltaTime;
            }
        }
    }
}