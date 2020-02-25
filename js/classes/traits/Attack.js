import Trait from './Trait.js';
import {globalSoundBoard} from '../../main.js';

//temporary (to test creature on creature interaction)
import {player1} from '../../main.js';

export default class Attack extends Trait {
    constructor(cell){
        super('attack');

        //TODO this is a circular reference, should fix and make traits make more sense
        this.cell = cell;
        this.sinkDelay = 0;
    }

    start(weapon, player){
        if(!this.cell.duringSinkingAnimation && !this.cell.isProtected){
            globalSoundBoard.play('bonkEnemy');
            this.cell.creature.damage(weapon.power);
        }
    }
    start2(amount){
        if(!this.cell.duringSinkingAnimation && !this.cell.isProtected){
            globalSoundBoard.play('bonkEnemy');
            this.cell.creature.damage(amount);
        }
    }
    //kill creature, the player is passed as an argument so their score will be increased
    kill(player){
        if(!this.cell.duringSinkingAnimation){
            this.cell.creature.playSound('kill', 80);
            const delay = this.cell.creature.kill();

            if(delay === 0){
                player.addScore(this.cell.creature.scoreValue);
                this.cell.duringSinkingAnimation = true;
            }else if( delay > 0){
                this.sinkDelay = delay;
                //should score be added here?
                player.addScore(this.cell.creature.scoreValue);
                this.cell.duringSinkingAnimation = true;
            }else{
                //negative delay here is a special case where the cell shouldn't sink or die after the creature was killed. If killing a creature would replace it with another creature for example, that kill function should return a negative delay
            }
        }
    }

    update(deltaTime){
        if(this.cell.creature && this.cell.creature.health <= 0){
            this.cell.attack.kill(player1);
        }

        if(this.sinkDelay >= 0){
            this.sinkDelay -= deltaTime;
        }else{
            if(this.cell.duringSinkingAnimation && this.cell.depth < this.cell.maxDepth){
                this.cell.depth += this.cell.speed * deltaTime;
            }else if(this.cell.duringSinkingAnimation && this.cell.depth >= this.cell.maxDepth){
                this.cell.duringSinkingAnimation = false;
                this.cell.reset();
            }
        }
    }
}