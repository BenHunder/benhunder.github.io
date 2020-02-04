import Creature from "./Creature.js";
import Trait from "./traits/Trait.js";

import * as allAbilities from '../abilities.js'

//do we need this? or do we just need to pass a function that returns a new creature or something. i am getting confused. this factory thing seems like a lot of unnecessary work

export class CreatureFactory{
    //TODO should spriteSheet and soundBoard really be passed in here? If so, creature should have a function to play sounds like its draw method 
    constructor(spriteSheet, soundBoard, name, width, height, attributes){
        this.spriteSheet = spriteSheet;
        this.soundBoard = soundBoard;
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

    }

    create(){
        let creature = new Creature(this.spriteSheet, this.soundBoard);

        creature.name = this.name;
        creature.width = this.width;
        creature.height = this.height;
        creature.health = this.health;
        creature.hunger = this.hunger
        creature.maxHunger = this.maxHunger;
        creature.hungerRate = this.hungerRate;
        creature.type = this.type;
        creature.scoreValue = this.scoreValue;
        creature.creatureFactory = this;
        creature.abilities = this.abilities;

        const abilitiesArray = [];
        this.abilities.forEach( ability => {
            //this assumes there is a function with the same name in abilities.js
            abilitiesArray.push(allAbilities[ability](creature));
        });

        this.traits.forEach( traitName => {
            //TODO eventually traits will be defined in the JSON or somehting I guess, but for now, they are just strings. This line is pretty useless rn
            creature.addTrait(new Trait(traitName));
        });

        return Object.assign(creature, ...abilitiesArray);
    }
}