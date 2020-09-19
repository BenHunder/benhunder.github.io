import Creature from '/js/classes/Creature.js'

export default class Dragon extends Creature{
    constructor(){


        super()
        this.name = "dragon";
        this.height = 40;
        this.width = 32;
        this.health = 20;
        this.alignment =  "ally";
    }
}