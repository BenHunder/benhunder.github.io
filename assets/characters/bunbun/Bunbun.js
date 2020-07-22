import Creature from '/js/classes/Creature.js'

export default class Bunbun extends Creature{
    constructor(creatureChance, creatureCluster, selectionCell){

        const traits = [
            {
                "name": "hit",
                "rate": 2.5,
                "damage": 1,
                "animationOffset": 0.3
            }
        ];

        super(traits)
        this.name = "bunbun";
        this.height = 32;
        this.width = 32;
        this.maxHealth = 10;
        this.health = this.maxHealth;
        this.scoreValue = 10;
        this.type =  "enemy";
    }
}