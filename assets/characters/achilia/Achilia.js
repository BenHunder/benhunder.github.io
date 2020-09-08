import Creature from '/js/classes/Creature.js';
import { cellMap } from '../../../js/main.js';

export default class Achilia extends Creature{
    constructor(isMaster = false){

        const traits = [
            {
                "name": "hit",
                "rate": 5,
                "damage": 5,
                "animationOffset": 2.75
            }
        ];
        super(traits, 'achilia', isMaster);
        this.height = 32;
        this.width = 32;
        this.maxHealth = 1;
        this.health = this.maxHealth;
        this.scoreValue = 0;
        this.propogationRate = 0.15;
        this.alignment =  "enemy";

        
    }

    ageMe(){
        this.age += 1;
        super.attemptPropogation();
    }

    evolve(){}

    //if this achilia is the master, it should kill all offspring.
    //todo? fix this so its possible to determine all of one achilia's offspring
    kill(){
        if(this.isMaster){
            cellMap.occupiedCells().forEach(([name, cell]) => {
                //check if creatures are the same class
                //todo: issue how to deal with multiple master creatures
                if(cell.creature.constructor === this.constructor && cell.name != this.currentCell.name && !cell.creature.isMaster){
                    cell.attack.kill();
                }
            });
        }
        return 0;
    }
}