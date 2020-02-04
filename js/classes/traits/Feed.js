import Trait from './Trait.js';
import {globalSoundBoard} from '../../main.js';

//TODO this is temporary just to test the multiply function
import {cellMap} from '../../main.js';

export default class Feed extends Trait {
    constructor(cell){
        super('feed');

        //TODO this is a circular reference, should fix and make traits make more sense
        this.cell = cell;
    }

    start(food){
        globalSoundBoard.play('feed');

        //this.cell.creature.teleport(cellMap, this.cell);
        this.cell.creature.hunger += food.power;  
        if(this.cell.creature.hunger > this.cell.creature.maxHunger){
            this.cell.creature.hunger = this.cell.creature.maxHunger;
        }
    }

    kill(){
        this.cell.duringSinkingAnimation = true;
    }

    update(deltaTime){
        if(this.cell.isActive && this.cell.creature.type === "plant"){
            this.cell.creature.hunger -= this.cell.creature.hungerRate * deltaTime;
            if(!this.cell.duringSinkingAnimation && this.cell.creature.hunger <= 0){
                this.cell.feed.kill();
            }
        }
    }
}