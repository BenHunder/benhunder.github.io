import Creature from '/js/classes/Creature.js'
import { currentLevel } from '../../../js/main.js';

export default class Protector extends Creature{
    constructor(creatureChance, creatureCluster, selectionCell){

        super();
        this.name = "protector";
        this.height = 32;
        this.width = 32;

        this.alignment =  "ally";

        this.maxHealth = 15;
        this.health = this.maxHealth;
        
        this.power = 10;
        
    }

    attemptFight(){
        const targetCell = currentLevel.cellMap.randomAdjacentTarget(this.currentCell, "ally");
        if(targetCell){
            targetCell.attack(this.power);
        }
    }
}