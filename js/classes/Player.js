export default class Player{
    constructor(){
        this.baseScore = 0;
        this.baseNumAllies = 1;
        this.maxAmmo = 1;

        this.score = this.baseScore;
        this.alliesLeft = this.baseNumAllies;
        this.weapon = null;
        this.ammo = this.maxAmmo;

        this.unlocked = new Map();
        this.unlocked.set("mushboy", true);
        this.unlocked.set("bunbun", true);

        this.startingEnergy = 20;
        this.energy = this.startingEnergy;
        this.maxEnergy = 100;

        this.creatureFactories = [];
        this.specialSelection = 0;
    }

    addScore(amount){
        this.score += amount;
    }

    reset(){
        this.energy = this.startingEnergy;
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

    selectedSpecial(){
        return this.creatureFactories[this.specialSelection];
    }

    addEnergy(amount=1){
        this.energy += amount;
        if(this.energy > this.maxEnergy){
            this.energy = this.maxEnergy;
        }
    }

}