import Creature from '/js/classes/Creature.js'

export default class Spiderboy extends Creature{
    constructor(creatureChance, creatureCluster, selectionCell){

        traits = [
            {
                "name": "hit",
                "rate": 5,
                "damage": 5,
                "animationOffset": 2.75
            },
            {
                "name": "persist",
                "regainRate": 5
            }
        ];

        super(traits)
        this.name = "spiderboy";
        this.height = 32;
        this.width = 32;
        this.maxHealth = 20;
        this.health = this.maxHealth;
        this.scoreValue = 10;
        this.type =  "ally";
    }
}