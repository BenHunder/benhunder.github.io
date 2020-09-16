import {getRandomInt} from '../math.js';
import {player1} from '../main.js'
import Dragon from '../../assets/characters/dragon/Dragon.js';
import Spiderboy from '../../assets/characters/spiderboy/Spiderboy.js';
import Protector from '../../assets/characters/protector/Protector.js';

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

        //raise spawnRate (lower frequency of spawns) when there are more creatures on the board, so players aren't overwhelmed
        //ie.. start faster, then get slower
        const thresh = this.spawnRate * (((this.cellMap.numEnemies()*5) + 5) / 29);
        //const thresh = this.spawnRate;

        if(this.counter >= thresh){
            this.spawnAll();
            this.counter = 0;
        }
    }

    initialSpawn(){
        //spawn random placements
        const density = 40;
        for (let i = 0; i < density; i++) {
            //this.spawnAll();
            if(i%2 == 0){
                this.cellMap.occupiedCells().forEach((cell) => cell.creature.ageMe());
            }
        }
    }

    spawnAll(){
        this.creatureFactories.forEach( creatureFactory => {
            const r = Math.random();
            if(r <= creatureFactory.chance){
                if (creatureFactory.cluster > 1){
                    this.spawnMultiple(creatureFactory);
                }else{
                    let creature = creatureFactory.create(true);
                    let cell = null;

                    if (creature instanceof Protector){
                        //pick a random occupied cell then spawn a protector next to it, protecting it
                        const targetCell = this.cellMap.randomOccupiedCell();
                        if(targetCell){
                            creature.targetCell = targetCell
                            cell = this.cellMap.randomAdjacentTo(creature.targetCell, 1)[0];
                        }
                    }else if (creature instanceof Dragon){
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
                    }else if(creature instanceof Spiderboy){
                        cell = this.cellMap.spiderSpawn();
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

    propogate(creature){
        const firstCell = creature.currentCell;
        if(firstCell){
            for (let i = 0; i < this.creatureFactories.length; i++) {
                const cf = this.creatureFactories[i];
                if(creature instanceof cf.creatureType){
                    const targetCell = this.cellMap.randomAdjacentTo(firstCell, 1)[0];
                    if(targetCell){
                        targetCell.spawnNew(cf.create());
                        console.log(firstCell.name + " propogated to " + targetCell.name);
                    }
                    break;
                }
            }
        }
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

    spawnSelections(){
        this.creatureFactories.forEach( creatureFactory => {
            if(player1.hasUnlocked(creatureFactory.name)){
                this.spawnCreatureAt(creatureFactory, creatureFactory.selectionCell);
            }
        });
    }

    spawnPredeterminedCreatures(){
        this.creatureFactories.forEach( creatureFactory => {
            if(player1.hasUnlocked(creatureFactory.name)){
                this.cellMap.get(creatureFactory.selectionCell).spawnNew(creatureFactory.create())
            }
        });
    }

    spawnCreatureAt(cf, cell){
        this.cellMap.get(cell).spawnNew(cf.create())
    }
}