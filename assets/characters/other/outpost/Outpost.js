import Creature from '/js/classes/Creature.js'
import { player1, spriteSheetMap } from '../../../../js/main.js';

export default class Outpost extends Creature{
    constructor(creatureChance, creatureCluster, selectionCell){

        super('outpost');
        this.height = 48;
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

}