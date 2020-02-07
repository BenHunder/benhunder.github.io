import Trait from './Trait.js';
import {globalSoundBoard} from '../../main.js';

export default class Protect extends Trait {
    constructor(creature){
        super('protect');

        //TODO this is a circular reference, should fix and make traits make more sense
        this.creature = creature;
    }

    update(deltaTime){
        if(this.creature.targetCell != null && !this.creature.targetCell.isProtected){
            this.creature.targetCell.isProtected = true;
        }
    }
}