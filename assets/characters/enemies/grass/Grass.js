import Creature from '/js/classes/Creature.js'

export default class Grass extends Creature{
    constructor(creatureChance, creatureCluster, selectionCell){

        super('grass');
        this.height = 32;
        this.width = 32;
        this.maxHealth = 10;
        this.health = this.maxHealth;
        this.propogationRate = 0.07;
        this.alignment =  "enemy";

        
    }

    attemptEvolution(){
        if(this.age > 0 && this.age%15 == 0 && this.evolution < 3){
            //evolve
            this.evolution += 1;
            const currentDamage = this.maxHealth - this.health;
            this.maxHealth += 10;
            this.health = this.maxHealth - currentDamage;
        }
    }
}