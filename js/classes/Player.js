export default class Player{
    constructor(){
        this.baseHealth = 1000;
        this.baseScore = 0;
        this.baseNumAllies = 1;
        this.maxAmmo = 1;

        this.health = this.baseHealth;
        this.score = this.baseScore;
        this.alliesLeft = this.baseNumAllies;
        this.weapon = null;
        this.food = null;
        this.ammo = this.maxAmmo;

        this.unlocked = new Map();
        this.unlocked.set("mushboy", true);
        this.unlocked.set("bunbun", true);

        this.allyReadyCounter = 0;

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
        this.allyReadyCounter = 0;
        //this.score = this.baseScore;
        //this.creatureFactories = [];
    }

    addCreature(creatureFactory){
        this.creatureFactories.push(creatureFactory);
    }

    clearCreatures(){
        this.creatureFactories = [];
        this.alliesLeft = this.baseNumAllies;
    }

    hasUnlocked(creature){
        return this.unlocked.get(creature);
    }

    reload(){
        this.ammo = this.maxAmmo;
    }

}