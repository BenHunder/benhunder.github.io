import { spriteSheetMap } from '../main.js';

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

    drawIcon(context, x, y){
        const spriteSheet = spriteSheetMap.get(this.name + '-e1');

        const buffer = spriteSheet.getBuffer('frame0');
        context.drawImage(buffer, x, y);
    }
}