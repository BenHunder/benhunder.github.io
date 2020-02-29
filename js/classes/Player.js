export default class Player{
    constructor(){
        this.baseHealth = 1000;
        this.baseScore = 0;

        this.health = this.baseHealth;
        this.score = this.baseScore;
        this.weapon = null;
        this.food = null;

        this.unlocked = new Map();
        this.unlocked.set("sprout", true);

        this.plantsLeft = 3;
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
    }

    hasUnlocked(creature){
        return this.unlocked.get(creature);
    }

}