import Creature from '/js/classes/Creature.js'
import { currentLevel } from '../../../js/main.js';

export default class Protector extends Creature{
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
        this.name = "protector";
        this.height = 32;
        this.width = 32;

        this.alignment =  "ally";
        this.scoreValue = 10;

        this.maxHealth = 50;
        this.health = this.maxHealth;
        
        this.power = 0;
        
    }

    ageMe(){
        const targetCell = currentLevel.cellMap.randomAdjacentTarget(this.currentCell, "enemy");
        if(targetCell){
            targetCell.attack.start2(this.power);
        }
    }
}