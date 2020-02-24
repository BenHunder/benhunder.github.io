import Creature from "./Creature.js";
import Trait from "./traits/Trait.js";
import {loadCreature} from "../loaders.js";

import * as allAbilities from '../abilities.js';
import Protect from "./traits/Protect.js";
import Hit from "./traits/Hit.js";
import Mystery from "./traits/Mystery.js";

//do we need this? or do we just need to pass a function that returns a new creature or something. i am getting confused. this factory thing seems like a lot of unnecessary work

export class CreatureFactory{
    //TODO should spriteSheet and soundBoard really be passed in here? If so, creature should have a function to play sounds like its draw method 
    constructor(spriteSheet, soundBoard, chance, cluster, name, width, height, attributes, subCreatureFactory){
        this.spriteSheet = spriteSheet;
        this.soundBoard = soundBoard;
        this.chance = chance;
        this.cluster = cluster;
        this.name = name;
        this.width = width;
        this.height = height;
        this.health = attributes.health || 20;
        this.maxHunger = attributes.maxHunger || 20;
        this.hunger = this.maxHunger;
        this.hungerRate = attributes.hungerRate || 1;
        this.type = attributes.type;
        //scoreValue is how many points a player receives if they kill this creature. If creature is an enemy, scoreValue will be defaulted to 10.
        this.scoreValue = attributes.scoreValue || this.type === "enemy" ? 10 : 0;
        
        this.traits = attributes.traits || [];
        this.abilities = attributes.abilities || [];
        this.subCreatureFactory = subCreatureFactory

    }

    create(){
        let creature = new Creature(this.spriteSheet, this.soundBoard);

        creature.name = this.name;
        creature.width = this.width;
        creature.height = this.height;
        creature.maxHealth = this.health;
        creature.health = this.health;
        creature.hunger = this.hunger
        creature.maxHunger = this.maxHunger;
        creature.hungerRate = this.hungerRate;
        creature.type = this.type;
        creature.scoreValue = this.scoreValue;
        creature.creatureFactory = this;
        creature.abilities = this.abilities;
        creature.subCreatureFactory = this.subCreatureFactory;

        const abilitiesArray = [];
        this.abilities.forEach( ability => {
            //this assumes there is a function with the same name in abilities.js
            abilitiesArray.push(allAbilities[ability](creature));
        });

        this.traits.forEach( trait => {
            if(trait.name === 'protect'){
                creature.addTrait(new Protect(creature));
            }else if(trait.name === 'hit'){
                creature.addTrait(new Hit(creature, trait));
            }else if(trait.name === 'mystery'){
                creature.addTrait(new Mystery(creature, trait));
            }

            //TODO eventually traits will be defined in the JSON or somehting I guess, but for now, they are just strings. This line is pretty useless rn
            //creature.addTrait(new Trait(traitName));
        });

        return Object.assign(creature, ...abilitiesArray);
    }
}