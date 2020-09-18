import Creature from '/js/classes/Creature.js'

export default class Sprout extends Creature{
    constructor(creatureChance, creatureCluster, selectionCell){

        super([], 'sprout')
        this.height = 16;
        this.width = 32;
        this.maxHealth = 20;
        this.health = this.maxHealth;
        this.maxHunger = 40;
        this.propogationRate = 0.02
        this.alignment =  "enemy";

        this.power = 2;
    }


    attemptFight(){
        const targetCell = currentLevel.cellMap.randomAdjacentTarget(this.currentCell, "ally");
        if(targetCell){
            console.log(this.currentCell.name + " attacks " + targetCell.name);
            targetCell.attack(this.power);
        }
    }

    attemptEvolution(){
        if(this.age%5 == 0 && this.evolution < 3){
            this.evolution += 1;
            const currentDamage = this.maxHealth - this.health;
            this.maxHealth += 10;
            this.health = this.maxHealth - currentDamage;
        }
    }
}

