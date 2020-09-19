import Creature from '/js/classes/Creature.js'

export default class Mushboy extends Creature{
    constructor(){

        super('mushboy')
        this.height = 40;
        this.width = 32;
        this.maxHealth = 20;
        this.health = this.maxHealth;
        this.alignment =  "ally";
    }

    ageMe(){
        this.age += 1;
    }
}