import Creature from '/js/classes/Creature.js'
import { currentLevel } from '../../../../js/main.js';

export default class Boxer extends Creature{
    constructor(){

        super();
        this.name = "boxer";
        this.height = 32;
        this.width = 32;

        this.alignment =  "ally";

        this.maxHealth = 30;
        this.health = this.maxHealth;
        
        this.power = 10;
        
    }

    attemptFight(){
        const targetCell = currentLevel.cellMap.randomAdjacentTarget(this.currentCell, ['ally', 'enemy']);
        if(targetCell){
            targetCell.attack(this.power);
        }
    }

    attemptEvolution(){
        if(this.age > 0 && this.age%10 == 0 && this.evolution < 2){
            //evolve
            this.evolution += 1;
            const currentDamage = this.maxHealth - this.health;
            this.maxHealth += 10;
            this.health = this.maxHealth - currentDamage;
        } 
    }
}