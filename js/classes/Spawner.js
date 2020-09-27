import {getRandomInt} from '../math.js';
import {player1} from '../main.js'
import Dragon from '../../assets/characters/allies/dragon/Dragon.js';
import Spiderboy from '../../assets/characters/allies/spiderboy/Spiderboy.js';
import Protector from '../../assets/characters/allies/protector/Protector.js';

export class Spawner{
    constructor(cellMap, spawnRate){
        this.cellMap = cellMap;
        this.creatureFactories = [];
        this.spawnRate = spawnRate;

        this.rainCells = [];
        this.rainTurns = 0;
        this.moveRainAfter = 1;
    }

    addCreature(creatureFactory){
        this.creatureFactories.push(creatureFactory);
    }

    updateRain(){
        if(this.rainTurns >= this.moveRainAfter){
            this.rainCells.forEach(cell => {
                cell.isRainedOn = false;
            });
            this.rainCells = this.cellMap.randomAvailableWithinTwo(this.rainCells[0], 1);
            
            // const center = this.cellMap.randomAvailableCell();
            // this.rainCells = this.cellMap.adjacentTo(center);
            // this.rainCells.push(center);
            // this.rainCells.push(this.cellMap.randomAvailableCell());
        }

        this.rainCells.forEach(cell => {
            cell.isRainedOn = true;
        });

        this.rainTurns += 1;
    }

    initialSpawn(){
        //spawn random placements
        const density = 10;
        for (let i = 0; i < density; i++) {
            //this.spawnAll();
            //if(i%2 == 0){
                this.cellMap.occupiedCells().forEach((cell) => {
                    cell.creature.attemptPropogation();
                    cell.creature.ageMe();
                    cell.creature.attemptEvolution();
                });
            //}
        }

        this.rainCells.push(this.cellMap.randomAvailableCell());
        console.log(this.rainCells);
        this.updateRain();
        console.log(this.rainCells);
    }

    spawnAll(){
        this.creatureFactories.forEach( creatureFactory => {
            if(creatureFactory.name == 'asteroid'){
                const r = Math.random();
                if(r <= creatureFactory.chance){
                    if (creatureFactory.cluster > 1){
                        this.spawnMultiple(creatureFactory);
                    }else{
                        let creature = creatureFactory.create(true);
                        const cell = this.cellMap.randomAvailableCell();
                        
                        if(cell){
                            cell.spawnNew(creature);
                        }
                    }
                }
            }
        });

        this.rainSpawn();
    }

    rainSpawn(){
        this.rainCells.forEach(cell => {
            let spawnedCreatures = [];
            this.creatureFactories.forEach( creatureFactory => {
                if(creatureFactory.group == 'enemies'){
                    const r = Math.random();
                    if(r <= creatureFactory.chance){
                        spawnedCreatures.push(creatureFactory);
                            
                    }
                }
            });

            if(spawnedCreatures.length > 0){
                const r = getRandomInt(spawnedCreatures.length);
                const creature = spawnedCreatures[r].create(true);
                
                cell.spawnNew(creature);
            }               
        });
    }

    propogate(creature){
        const firstCell = creature.currentCell;
        if(firstCell){
            for (let i = 0; i < this.creatureFactories.length; i++) {
                const cf = this.creatureFactories[i];
                if(creature instanceof cf.creatureType){
                    const targetCell = this.cellMap.randomAvailableAdjacent(firstCell, 1)[0];
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
            const spawns = this.cellMap.randomAvailableAdjacent(firstCell, creatureFactory.cluster);

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