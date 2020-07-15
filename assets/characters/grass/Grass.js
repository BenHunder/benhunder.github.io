import Creature from '/js/classes/Creature.js'

export default class Grass extends Creature{
    constructor(creatureChance, creatureCluster, selectionCell){

        const traits = [
            {
                "name": "hit",
                "rate": 5,
                "damage": 5,
                "animationOffset": 2.75
            }
        ];
        super(traits, 'grass');
        this.height = 32;
        this.width = 32;
        this.health = 10;
        this.scoreValue = 0;
        this.type =  "pl@nt";

        
    }
}