import Creature from '/js/classes/Creature.js'

export default class Protector extends Creature{
    constructor(spriteSheet, creatureChance, creatureCluster, selectionCell){

        traits = [
            {
                "name": "hit",
                "rate": 5,
                "damage": 5,
                "animationOffset": 2.75
            }
        ];

        super(spriteSheet, traits)
        this.name = "mushboy";
        this.height = 40;
        this.width = 32;
        this.health = 20;
        this.scoreValue = 10;
        this.alignment =  "ally";
    }
}