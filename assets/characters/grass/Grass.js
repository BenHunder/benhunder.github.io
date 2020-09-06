import Creature from '/js/classes/Creature.js'

export default class Grass extends Creature{
    constructor(creatureChance, creatureCluster, selectionCell){

        const traits = [
            {
                "name": "hit",
                "rate": 5,
                "damage": 5,
                "animationOffset": 2.75
            }
        ];
        super(traits, 'grass');
        this.height = 32;
        this.width = 32;
        this.maxHealth = 10;
        this.health = this.maxHealth;
        this.scoreValue = 0;
        this.propogationRate = 0.05;
        this.type =  "enemy";

        
    }

    ageMe(){
        this.age += 1;
        if(this.age%10 == 0 && this.evolution < 3){
            this.evolve();
        }
        super.attemptPropogation();
    }

    evolve(){
        this.evolution += 1;
        const currentDamage = this.maxHealth - this.health;
        this.maxHealth += 10;
        this.health = this.maxHealth - currentDamage;
    }
}