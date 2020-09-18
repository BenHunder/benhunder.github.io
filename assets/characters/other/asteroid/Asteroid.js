import Creature from '/js/classes/Creature.js'
import { player1, spriteSheetMap } from '../../../../js/main.js';

export default class Asteroid extends Creature{
    constructor(creatureChance, creatureCluster, selectionCell){

        super('asteroid');
        this.height = 48;
        this.width = 32;
        this.maxHealth = 10;
        this.health = this.maxHealth;
        this.alignment =  "neutral";

        
    }

    kill(){
        player1.addEnergy(10);
        let delay = 0;
        return delay;
    }

    draw(context, x, y, animationName){
        const spriteSheet = spriteSheetMap.get(this.eName());
        let name = 'frame' + this.currentFrame;

        //advance frames
        if(this.currentCell.duringSinkingAnimation){
            
        }else{
            this.counter = 0;
        }

        name = 'frame' + this.currentFrame;
        const buffer = spriteSheet.getBuffer(name);
        context.drawImage(buffer, x, y);
    }

}