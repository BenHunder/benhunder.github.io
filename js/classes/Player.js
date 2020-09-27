export default class Player{
    constructor(){
        this.baseScore = 0;
        this.baseNumAllies = 3;
        this.maxAmmo = 1;

        this.alliesLeft = this.baseNumAllies;
        this.weapon = null;
        this.ammo = this.maxAmmo;

        this.unlocked = new Map();
        this.unlocked.set("protector", true);
        this.unlocked.set("bunbun", true);
        this.unlocked.set("welder", true);
        this.unlocked.set("boxer", true);
        this.unlocked.set("dragon", true);
        this.unlocked.set("outpost", true);

        this.startingEnergy = 50;
        this.energy = this.startingEnergy;
        this.maxEnergy = 100;

        this.creatureFactories = [];
        this.specialSelection = 0;

        this.hasLost = false;
    }

    lose(){
        this.hasLost = true;
    }

    reset(){
        this.energy = this.startingEnergy;
        this.hasLost = false;
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

    nextSpecial(){
        this.specialSelection += 1;
        if(this.specialSelection == this.creatureFactories.length){
            this.specialSelection = 0;
        }
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