import Creature from '/js/classes/Creature.js'
import { currentLevel } from '../../../js/main.js';

export default class Welder extends Creature{
    constructor(creatureChance, creatureCluster, selectionCell){

        super();
        this.name = "welder";
        this.height = 32;
        this.width = 32;

        this.alignment =  "ally";

        this.maxHealth = 30;
        this.health = this.maxHealth;
        
        this.power = 10;
        
    }

    attemptFight(){
        let killedSomething = false;
        const targetCell = currentLevel.cellMap.randomAdjacentTarget(this.currentCell);
        if(targetCell){
            this.currentAnimation = 'fight';
            killedSomething = targetCell.attack(this.power);
            
            if(killedSomething <= 0){
                targetCell.moveTo(this);
            }
        }
    }
}