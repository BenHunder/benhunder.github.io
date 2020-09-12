import Creature from '/js/classes/Creature.js';
import { currentLevel } from '../../../js/main.js';

export default class Orchill extends Creature{
    constructor(isMaster = false){

        const traits = [
            {
                "name": "hit",
                "rate": 5,
                "damage": 5,
                "animationOffset": 2.75
            }
        ];
        super(traits, 'orchill', isMaster);
        this.height = 32;
        this.width = 32;
        this.maxHealth = 20;
        this.health = this.maxHealth;
        this.scoreValue = 0;
        this.propogationRate = 0.03;
        this.power = 2;
        this.alignment =  "enemy";

        
    }

    ageMe(){
        this.age += 1;
        this.attack();
        super.attemptPropogation();
        if(this.age%10 == 0 && this.evolution < 3){
            this.evolve();
        }
    }

    attack(){
        const targetCell = currentLevel.cellMap.randomAdjacentTarget(this.currentCell, "ally");
        if(targetCell){
            console.log(this.currentCell.name + " attacks " + targetCell.name);
            targetCell.attack.start2(this.power);
        }
    }

    evolve(){
        this.evolution += 1;
        const currentDamage = this.maxHealth - this.health;
        this.maxHealth += 10;
        this.health = this.maxHealth - currentDamage;

        this.power += 2
    }

}