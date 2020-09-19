import Creature from '/js/classes/Creature.js'

export default class Spiderboy extends Creature{
    constructor(){

        super();
        this.name = "spiderboy";
        this.height = 32;
        this.width = 32;
        this.maxHealth = 20;
        this.health = this.maxHealth;
        this.alignment =  "ally";
    }
}