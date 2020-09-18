import { Vec2 } from "../math.js";
import {getRandomInt} from '../math.js';
import Cell from './Cell.js';

//im sure there are better ways to do this, but this makes sense to me at this moment so, I'm rolling with it.
//cellMap contains a map so you can access cells by their corresponding letter (the key) and it contains a two dimensional array (this.grid) so cells can be accessed by x,y indices and math can be done to get neightboring cells

//TODO not sure if it would be useful yet, but all of these functions could accept another argument n which specify how many cells you want to retrieve in that direction. For example right(myCell, 2) would return the cell immediately to the right of myCell and the cell two to the right of myCell. In this case argument overloading would be necessary (https://stackoverflow.com/questions/10855908/how-to-overload-functions-in-javascript/10855939)
export default class CellMap{
    constructor(gridWidth, gridHeight){
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        this.letterMap = new Map();
        this.grid = [];
        for(let i = 0; i < gridHeight; i++){
            this.grid[i] = new Array();
            for(let j = 0; j < gridWidth; j++){
                this.grid[i][j] = {i, j};
            }
        }
    }

    set(key, indices, cell){
        //console.log(key, indices);
        //console.log("982739847293874", JSON.parse(JSON.stringify(this.grid)));
        this.letterMap.set(key, cell);
        this.grid[indices.y][indices.x] = cell;
        //console.log("cell set to: ", this.grid[indices.x][indices.y]);
        //console.log("------09304909------", JSON.parse(JSON.stringify(this.grid)));
    }

    get(key){
        if(typeof(key) === "string"){
            return this.letterMap.get(key);
        }else if(typeof(key) === "object"){
            //grid width doesnt work too well here because each row has a different width, but the instanceof fix works for now
            if((key.x >= 0) && (key.x < this.gridWidth) && (key.y >= 0) && (key.y < this.gridHeight)){
                const cell = this.grid[key.y][key.x];
                return cell instanceof Cell ? cell:null;
            }else{
                return null;
            }
        }
    }

    right(cell){
        const x = cell.indices.x + 1;
        const y = cell.indices.y;

        return this.get(new Vec2(x, y));
    }

    left(cell){
        const x = cell.indices.x - 1;
        const y = cell.indices.y;

        return this.get(new Vec2(x, y));
    }

    upperRight(cell){
        const x = cell.indices.y % 2 == 0 ? cell.indices.x : cell.indices.x + 1;
        const y = cell.indices.y - 1;

        return this.get(new Vec2(x, y));
    }

    lowerRight(cell){
        const x = cell.indices.y % 2 == 0 ? cell.indices.x : cell.indices.x + 1;
        const y = cell.indices.y + 1;

        return this.get(new Vec2(x, y));
    }

    upperLeft(cell){
        const x = cell.indices.y % 2 == 0 ? cell.indices.x - 1 : cell.indices.x;
        const y = cell.indices.y - 1;

        return this.get(new Vec2(x, y));
    }

    lowerLeft(cell){
        const x = cell.indices.y % 2 == 0 ? cell.indices.x - 1 : cell.indices.x;
        const y = cell.indices.y + 1;

        return this.get(new Vec2(x, y));
    }

    corners(cell){
        return [
            this.upperLeft(cell),
            this.upperRight(cell),
            this.lowerLeft(cell),
            this.lowerRight(cell),
        ]
    }

    adjacentTo(cell){
        return [
            this.upperLeft(cell),
            this.upperRight(cell),
            this.left(cell),
            this.right(cell),
            this.lowerLeft(cell),
            this.lowerRight(cell),
        ].filter((item) => item != null)
    }

    availableAdjacentTo(cell){
        return this.adjacentTo(cell).filter(cell => cell.isSpawnable());
    }

    randomAdjacentTarget(cell, alignment = null){
        let occupied = null;
        if(alignment){
            occupied = this.adjacentTo(cell).filter(cell => cell.isActive && cell.creature.alignment === alignment);    
        }else{
            occupied = this.adjacentTo(cell).filter(cell => cell.isActive && cell.creature.alignment != "neutral");
        }
        let r = getRandomInt(occupied.length);
        return occupied.length > 0 ? occupied[r]:null;
    }

    //returns an array of max length n (could be less) of random cells adjacent to cell
    randomAdjacentTo(cell, n){
        let cells = [];

        let possibleCells = this.availableAdjacentTo(cell);
        for(let i = 0; i < n; i++){
            if(possibleCells.length > 0){
                let r = getRandomInt(possibleCells.length);
                const newSpawn = possibleCells.splice(r, 1);
                cells.push(newSpawn[0]);
            }else{
                //not enough available adjecent spaces, return as many as possible
                break;
            }
        }

        return cells;
    }

    allCells(){
        return Array.from(this.letterMap.values());
    }

    availableCells(){
        return this.allCells().filter((cell) => !cell.isActive);
    }

    occupiedCells(){
        return this.allCells().filter((cell) => cell.isActive && !cell.duringSinkingAnimation);
    }

    enemyCells(){
        return this.occupiedCells().filter((cell) => cell.creature.alignment === "enemy");
    }

    numEnemies(){
        return this.occupiedCells().filter((cell) => cell.creature.alignment == "enemy").length;
    }
    
    randomAvailableCell(){
        const availableCells = this.availableCells();
        if(availableCells.length > 0){
            const i = getRandomInt(availableCells.length);
            return availableCells[i];
        }
    }

    randomOccupiedCell(){
        const occupiedCells = this.occupiedCells();
        if(occupiedCells.length > 0){
            const i = getRandomInt(occupiedCells.length);
            return occupiedCells[i];
        }
    }

    //TODO am i sure this works?
    areAdjacent(cell1, cell2){
        const x1 = cell1.indices.x;
        const x2 = cell2.indices.x;
        const y1 = cell1.indices.y;
        const y2 = cell2.indices.y;

        return (Math.abs(x1 - x2) <= 1) && (Math.abs(y1 - y2) <= 1)
    }

    //picks a random cell, if there is another spider in the row, try (just once for now) a different cell
    spiderSpawn(){
        for(let i = 0; i < 2; i++){
            let tryCell = this.randomAvailableCell();
            let row = this.grid[tryCell.indices.x];
            let foundSpider = row.filter(cell => cell.isActive && cell.creature instanceof Spiderboy);
            if(foundSpider.length == 0){
                return tryCell;
            }
        }

        return null;
    }

    findOutposts(){
        return this.availableCells().filter(cell => cell.terrain === "outpost")
    }

    getActiveCreatures(){
        return this.allCells().filter((cell) => cell.isActive && !cell.duringSinkingAnimation).map(cell => cell.creature);
    }
}