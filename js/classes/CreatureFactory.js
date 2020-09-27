export class CreatureFactory{
    constructor(creatureType, creatureName, chance, cluster, selectionCell, creatureCost, creatureGroup){
        this.creatureType = creatureType;
        this.chance = chance;
        this.cluster = cluster;
        this.selectionCell = selectionCell;
        this.name = creatureName
        this.group = creatureGroup;

        //amount of energy needed to spawn
        this.cost = creatureCost;
    }

    create(isMaster = false){
        const creature = new this.creatureType(isMaster);
        return creature;
    }
}