import Trait from './Trait.js';
import {globalSoundBoard} from '../../main.js';
import {player1} from '../../main.js';

export default class Hit extends Trait {
    constructor(creature, rate, damage){
        super('hit');

        //TODO this is a circular reference, should fix and make traits make more sense
        this.creature = creature;
        this.rate = rate;
        this.damage = damage;

        this.counter = 0;
    }

    start(){
        //this.creature.attackAnimate();
        player1.damage(this.damage);
    }

    update(deltaTime){
        this.counter += deltaTime;
        if(this.counter >= this.rate){
            this.start();
            this.counter = 0;
        }
    }
}