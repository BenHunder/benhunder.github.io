import Creature from '/js/classes/Creature.js'
import { player1, currentLevel, spriteSheetMap } from '../../../../js/main.js';

export default class Outpost extends Creature{
    constructor(){

        super('outpost');
        this.height = 32;
        this.width = 32;
        this.maxHealth = 10;
        this.health = this.maxHealth;
        this.alignment =  "outpost";

        
    }

    kill(){
        player1.lose();
        console.log("you lost");
        let delay = 0;
        return delay;
    }

    ageMe(){
        this.age += 1;

        this.currentCell.isExplored = true;
        currentLevel.cellMap.withinTwo(this.currentCell).forEach( cell => cell.isExplored = true);
    }

}