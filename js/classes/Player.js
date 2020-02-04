export default class Player{
    constructor(){
        this.baseHealth = 100;
        this.baseScore = 0;

        this.health = this.baseHealth;
        this.score = this.baseScore;
        this.weapon = null;
        this.food = null;
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

}