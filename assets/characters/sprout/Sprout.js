import Creature from '/js/classes/Creature.js'

export default class Sprout extends Creature{
    constructor(creatureChance, creatureCluster, selectionCell){

        super([], 'sprout')
        this.height = 16;
        this.width = 32;
        this.health = 10;
        this.maxHunger = 40;
        this.scoreValue = 0;
        this.type =  "pl@nt";
    }
}

