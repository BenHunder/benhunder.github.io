import Trait from './Trait.js';
import {globalSoundBoard} from '../../main.js';
import {player1} from '../../main.js';
import {game1} from '../../main.js';
import {cellMap} from '../../main.js';

export default class Mystery extends Trait {
    constructor(creature, trait){
        super('hit');

        //TODO this is a circular reference, should fix and make traits make more sense
        this.creature = creature;
        this.rate = trait.rate;
        this.numItems = trait.numItems;

        this.cycling = true;
        this.counter = 0;
    }

    kill(){
        this.cycling = false;
        let frame = this.creature.currentFrame;
        this.creature.currentFrame = frame + this.numItems;
        switch (frame){
            case 0:
                return 1;
            case 1:
                return this.mushroom();
            case 2:
                return this.hourglass();
            case 3:
                return this.lightning();
            case 4:
                return this.bomb();
            case 5:
                return this.heart();
            default: 

        }
    }

    mushroom(){
        this.creature.currentCell.replace(this.creature.subCreatureFactory.create());
        return -1;
    }

    hourglass(){
        game1.subtractTime(10);
        return 1;
    }

    lightning(){
        cellMap.occupiedCells().forEach( ([name, cell]) => {
            if(cell.creature.alighnment === "enemy"){
                cell.attack.kill(player1);
            }
        });
        return 1;
    }

    bomb(){
        player1.damage(25);
        return 1;
    }

    heart(){
        player1.heal(25);
        return 1;
    }


    update(deltaTime){
        if(this.cycling){
            this.counter += deltaTime;
            if(this.counter >= this.rate){
                this.counter = 0;

                let frame = this.creature.currentFrame + 1;
                if(frame > (this.numItems - 1)){
                    frame = 0;
                }

                this.creature.currentFrame = frame;
            }
        }
    }
}