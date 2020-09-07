import Creature from '/js/classes/Creature.js'

export default class Achilia extends Creature{
    constructor(creatureChance, creatureCluster, selectionCell){

        const traits = [
            {
                "name": "hit",
                "rate": 5,
                "damage": 5,
                "animationOffset": 2.75
            }
        ];
        super(traits, 'achilia');
        this.height = 32;
        this.width = 32;
        this.maxHealth = 10;
        this.health = this.maxHealth;
        this.scoreValue = 0;
        this.propogationRate = 0.1;
        this.type =  "enemy";

        
    }

    ageMe(){
        this.age += 1;
        super.attemptPropogation();
    }

    evolve(){}
}