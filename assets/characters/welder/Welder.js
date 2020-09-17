import Creature from '/js/classes/Creature.js'
import { currentLevel } from '../../../js/main.js';

export default class Welder extends Creature{
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
        this.name = "welder";
        this.height = 32;
        this.width = 32;

        this.alignment =  "ally";
        this.scoreValue = 10;

        this.maxHealth = 30;
        this.health = this.maxHealth;
        
        this.power = 10;
        
    }

    ageMe(){
        const targetCell = currentLevel.cellMap.randomAdjacentTarget(this.currentCell);
        if(targetCell){
            targetCell.attack.start2(this.power);
        }
    }
}