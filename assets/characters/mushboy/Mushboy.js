import Creature from '/js/classes/Creature.js'

export default class Mushboy extends Creature{
    constructor(creatureChance, creatureCluster, selectionCell){

        const traits = [
            {
                "name": "hit",
                "rate": 5,
                "damage": 5,
                "animationOffset": 2.75
            }
        ];

        super(traits, 'mushboy')
        this.height = 40;
        this.width = 32;
        this.health = 20;
        this.scoreValue = 10;
        this.type =  "enemy";
    }

    ageMe(){
        this.age += 1;
        console.log("age mushboy")
    }
}