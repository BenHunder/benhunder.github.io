import Creature from "./Creature.js";
import Trait from "./traits/Trait.js";
import {loadCreatureType} from "../loaders.js";

import * as allAbilities from '../abilities.js';
import Protect from "./traits/Protect.js";
import Hit from "./traits/Hit.js";
import Mystery from "./traits/Mystery.js";
import Persist from "./traits/Persist.js";

//do we need this? or do we just need to pass a function that returns a new creature or something. i am getting confused. this factory thing seems like a lot of unnecessary work

export class CreatureFactory{
    constructor(creatureType, chance, cluster, selectionCell, creatureName){
        this.creatureType = creatureType;
        this.chance = chance;
        this.cluster = cluster;
        this.selectionCell = selectionCell;
        this.name = creatureName
    }

    create(){
        const creature = new this.creatureType();
        return creature;
    }
}