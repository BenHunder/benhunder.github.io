import Creature from '/js/classes/Creature.js'
import { cellMap } from '../../../js/main.js';

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

        this.alignment =  "ally";
        this.scoreValue = 10;

        this.maxHealth = 30;
        this.health = this.maxHealth;
        
        this.power = 10;
        
    }

    ageMe(){
        const targetCell = cellMap.randomAdjacentTarget(this.currentCell, "enemy");
        if(targetCell){
            targetCell.attack.start2(this.power);
        }
    }
}