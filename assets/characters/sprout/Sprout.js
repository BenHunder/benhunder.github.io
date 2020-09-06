import Creature from '/js/classes/Creature.js'

export default class Sprout extends Creature{
    constructor(creatureChance, creatureCluster, selectionCell){

        super([], 'sprout')
        this.height = 16;
        this.width = 32;
        this.maxHealth = 10;
        this.health = this.maxHealth;
        this.maxHunger = 40;
        this.scoreValue = 0;
        this.type =  "enemy";
    }
}

