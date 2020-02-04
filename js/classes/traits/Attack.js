import Trait from './Trait.js';
import {globalSoundBoard} from '../../main.js';

export default class Attack extends Trait {
    constructor(cell){
        super('attack');

        //TODO this is a circular reference, should fix and make traits make more sense
        this.cell = cell;
    }

    start(weapon, player){
        if(!this.cell.duringSinkingAnimation){
            globalSoundBoard.play('bonkEnemy');

            this.cell.creature.health -= weapon.power;
            if(this.cell.creature.health <= 0){
                this.cell.attack.kill(player);
            }
        }
    }
    //kill creature, the player is passed as an argument so their score will be increased
    kill(player){
        if(!this.cell.duringSinkingAnimation){
            this.cell.creature.playSound('kill', 80);
            player.addScore(this.cell.creature.scoreValue);
            this.cell.duringSinkingAnimation = true;
        }
    }

    update(deltaTime){
        if(this.cell.duringSinkingAnimation && this.cell.depth < this.cell.maxDepth){
            this.cell.depth += this.cell.speed * deltaTime;
        }else if(this.cell.duringSinkingAnimation && this.cell.depth >= this.cell.maxDepth){
            this.cell.duringSinkingAnimation = false;
            this.cell.reset();
        }
    }
}