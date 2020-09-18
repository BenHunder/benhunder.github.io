import Creature from '/js/classes/Creature.js'
import { currentLevel } from '../../../js/main.js';

export default class Bunbun extends Creature{
    constructor(creatureChance, creatureCluster, selectionCell){

        super();
        this.name = "bunbun";
        this.height = 32;
        this.width = 32;

        this.alignment =  "ally";

        this.maxHealth = 30;
        this.health = this.maxHealth;
        
        this.power = 10;
        
    }

    attemptFight(){
        const targetCell = currentLevel.cellMap.randomAdjacentTarget(this.currentCell);
        if(targetCell){
            targetCell.attack(this.power);
        }
    }
}