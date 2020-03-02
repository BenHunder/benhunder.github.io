export default class Player{
    constructor(){
        this.baseHealth = 1000;
        this.baseScore = 0;
        this.baseNumPlants = 1;

        this.health = this.baseHealth;
        this.score = this.baseScore;
        this.plantsLeft = this.baseNumPlants;
        this.weapon = null;
        this.food = null;

        this.unlocked = new Map();
        this.unlocked.set("sprout", true);
        this.unlocked.set("grass", true);

        this.creatureFactories = [];
    }

    heal(amount){
        this.health += amount;    
    }

    damage(amount){
        this.health -= amount;
    }

    addScore(amount){
        this.score += amount;
    }

    reset(){
        this.health = this.baseHealth;
        this.score = this.baseScore;
        this.plantsLeft = this.baseNumPlants;
        this.creatureFactories = [];
    }

    addCreature(creatureFactory){
        this.creatureFactories.push(creatureFactory);
    }

    clearCreatures(){
        this.creatureFactory = [];
    }

    hasUnlocked(creature){
        return this.unlocked.get(creature);
    }

}