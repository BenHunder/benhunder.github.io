import {getRandomInt} from '../math.js';

export class Spawner{
    constructor(cellMap, spawnRate){
        this.cellMap = cellMap;
        this.creatureFactories = [];
        this.spawnRate = spawnRate;
        this.counter = 0;
    }

    addCreature(creatureFactory){
        this.creatureFactories.push(creatureFactory);
    }


    update(deltaTime){
        this.counter += deltaTime;
        if(this.counter >= this.spawnRate){
            this.spawnAll();
            this.counter = 0;
        }
    }

    spawnAll(){
        this.creatureFactories.forEach( creatureFactory => {
            let r = Math.random();
            if(r <= creatureFactory.chance){
                if (creatureFactory.cluster > 1){
                    this.spawnMultiple(creatureFactory);
                }else{
                    let creature = creatureFactory.create();
                    let cell = null;

                    if (creature.name == 'protector'){
                        //pick a random occupied cell then spawn a protector next to it, protecting it
                        const targetCell = this.cellMap.randomOccupiedCell();
                        if(targetCell){
                            creature.targetCell = targetCell
                            cell = this.cellMap.randomAdjacentTo(creature.targetCell, 1)[0];
                        }
                    }else if (creature.name == 'dragon'){
                        //pick a random cell and try to find two available adjacent cells to spawn protectors protecting the dragon
                        cell = this.cellMap.randomAvailableCell();
                        if(cell){
                            const protectorCells = this.cellMap.randomAdjacentTo(cell, 2);
                            protectorCells.forEach( c => {
                                let protector = creature.subCreatureFactory.create();
                                protector.targetCell = cell;
                                c.spawnNew(protector);
                            })
                        }
                    }else{
                        cell = this.cellMap.randomAvailableCell();
                    }
                    
                    if(cell){
                        cell.spawnNew(creature);
                    }
                }
            }
        });
    }

    //tries to spawn a group of size = spawnCluster
    spawnMultiple(creatureFactory){
        const firstCell = this.cellMap.randomAvailableCell();
        if(firstCell){
            const spawns = this.cellMap.randomAdjacentTo(firstCell, creatureFactory.cluster);

            firstCell.spawnNew(creatureFactory.create());
            spawns.forEach(cell => {
                cell.spawnNew(creatureFactory.create());
            });
        }
    }
}