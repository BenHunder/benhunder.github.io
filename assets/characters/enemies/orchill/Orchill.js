import Creature from '/js/classes/Creature.js';
import { currentLevel } from '../../../../js/main.js';

export default class Orchill extends Creature{
    constructor(isMaster = false){

        super('orchill', isMaster);
        this.height = 32;
        this.width = 32;
        this.maxHealth = 20;
        this.health = this.maxHealth;
        this.propogationRate = 0.03;
        this.power = 3;
        this.alignment =  "enemy";

        
    }

    attemptFight(){
        const targetCell = currentLevel.cellMap.randomAdjacentTarget(this.currentCell, "ally");
        if(targetCell){
            console.log(this.currentCell.name + " attacks " + targetCell.name);
            targetCell.attack(this.power);
        }
    }

    attemptEvolution(){
        if(this.age > 0 && this.age%10 == 0 && this.evolution < 3){
            this.evolution += 1;
            const currentDamage = this.maxHealth - this.health;
            this.maxHealth += 10;
            this.health = this.maxHealth - currentDamage;

            this.power += 2
        }
    }

}