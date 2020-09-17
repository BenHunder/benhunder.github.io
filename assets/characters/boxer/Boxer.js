import Creature from '/js/classes/Creature.js'
import { currentLevel } from '../../../js/main.js';

export default class Boxer extends Creature{
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
        this.name = "boxer";
        this.height = 32;
        this.width = 32;

        this.alignment =  "ally";
        this.scoreValue = 10;

        this.maxHealth = 30;
        this.health = this.maxHealth;
        
        this.power = 10;
        
    }

    ageMe(){
        this.age += 1;
        const targetCell = currentLevel.cellMap.randomAdjacentTarget(this.currentCell);
        if(targetCell){
            targetCell.attack.start2(this.power);
        }
        if(this.age%10 == 0 && this.evolution < 2){
            this.evolve();
        }
    }

    evolve(){
        console.log("evolving boxer?", this.age)
        this.evolution += 1;
        const currentDamage = this.maxHealth - this.health;
        this.maxHealth += 10;
        this.health = this.maxHealth - currentDamage;
    }
}