import Creature from '/js/classes/Creature.js';
import { currentLevel } from '../../../../js/main.js';

export default class Achilia extends Creature{
    constructor(isMaster = false){

        super('achilia', isMaster);
        this.height = 32;
        this.width = 32;
        this.maxHealth = 1;
        this.health = this.maxHealth;
        this.propogationRate = 0.15;
        this.alignment =  "enemy";

        this.power = 1;

        
    }

    attemptFight(){
        const targetCell = currentLevel.cellMap.randomAdjacentTarget(this.currentCell, ['ally', 'outpost']);
        if(targetCell){
            console.log(this.currentCell.name + " attacks " + targetCell.name);
            targetCell.attack(this.power);
        }
    }

    //if this achilia is the master, it should kill all offspring.
    //todo? fix this so its possible to determine all of one achilia's offspring
    kill(){
        if(this.isMaster){
            currentLevel.cellMap.occupiedCells().forEach((cell) => {
                //check if creatures are the same class
                //todo: issue how to deal with multiple master creatures
                if(cell.creature.constructor === this.constructor && cell.name != this.currentCell.name && !cell.creature.isMaster){
                    cell.kill();
                }
            });
        }
        return 0;
    }
}