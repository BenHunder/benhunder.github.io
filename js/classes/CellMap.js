import { Vec2 } from "../math.js";
import {getRandomInt} from '../math.js';

//im sure there are better ways to do this, but this makes sense to me at this moment so, I'm rolling with it.
//cellMap contains a map so you can access cells by their corresponding letter (the key) and it contains a two dimensional array (this.grid) so cells can be accessed by x,y coordinates and math can be done to get neightboring cells

//TODO not sure if it would be useful yet, but all of these functions could accept another argument n which specify how many cells you want to retrieve in that direction. For example right(myCell, 2) would return the cell immediately to the right of myCell and the cell two to the right of myCell. In this case argument overloading would be necessary (https://stackoverflow.com/questions/10855908/how-to-overload-functions-in-javascript/10855939)
export default class CellMap{
    constructor(gridWidth, gridHeight){
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        this.letterMap = new Map();
        this.grid = [];
        for(let i = 0; i < gridWidth; i++){
            this.grid[i] = new Array();
            for(let j = 0; j < gridHeight; j++){
                this.grid[i][j] = {i, j};
            }
        }
    }

    set(key, coordinates, cell){
        //console.log(key, coordinates);
        //console.log("982739847293874", JSON.parse(JSON.stringify(this.grid)));
        this.letterMap.set(key, cell);
        this.grid[coordinates.x][coordinates.y] = cell;
        //console.log("cell set to: ", this.grid[coordinates.x][coordinates.y]);
        //console.log("------09304909------", JSON.parse(JSON.stringify(this.grid)));
    }

    get(key){
        if(typeof(key) === "string"){
            return this.letterMap.get(key);
        }else if(typeof(key) === "object"){
            if((key.x >= 0) && (key.x < this.gridWidth) && (key.y >= 0) && (key.y < this.gridHeight)){
                return this.grid[key.x][key.y];
            }else{
                return null;
            }
        }
    }

    right(cell){
        const x = cell.coordinates.x + 1;
        const y = cell.coordinates.y;

        return this.get(new Vec2(x, y));
    }

    left(cell){
        const x = cell.coordinates.x - 1;
        const y = cell.coordinates.y;

        return this.get(new Vec2(x, y));
    }

    above(cell){
        const x = cell.coordinates.x;
        const y = cell.coordinates.y - 1;

        return this.get(new Vec2(x, y));
    }

    below(cell){
        const x = cell.coordinates.x;
        const y = cell.coordinates.y + 1;

        return this.get(new Vec2(x, y));
    }

    upperRight(cell){
        const x = cell.coordinates.x + 1;
        const y = cell.coordinates.y - 1;

        return this.get(new Vec2(x, y));
    }

    lowerRight(cell){
        const x = cell.coordinates.x + 1;
        const y = cell.coordinates.y + 1;

        return this.get(new Vec2(x, y));
    }

    upperLeft(cell){
        const x = cell.coordinates.x - 1;
        const y = cell.coordinates.y - 1;

        return this.get(new Vec2(x, y));
    }

    lowerLeft(cell){
        const x = cell.coordinates.x - 1;
        const y = cell.coordinates.y + 1;

        return this.get(new Vec2(x, y));
    }

    cross(cell){
        return [
            this.above(cell),
            this.left(cell),
            this.right(cell),
            this.below(cell),
        ]
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
            this.above(cell),
            this.upperRight(cell),
            this.left(cell),
            this.right(cell),
            this.lowerLeft(cell),
            this.below(cell),
            this.lowerRight(cell),
        ].filter((item) => item != null)
    }

    availableAdjacentTo(cell){
        return this.adjacentTo(cell).filter(cell => !cell.isActive);
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
        return Array.from(this.letterMap);
    }

    availableCells(){
        return this.allCells().filter(([name,cell]) => !cell.isActive);
    }

    randomAvailableCell(){
        const availableCells = this.availableCells();
        if(availableCells.length > 0){
            const i = getRandomInt(availableCells.length);
            return availableCells[i][1];
        }
    }

    //TODO am i sure this works?
    areAdjacent(cell1, cell2){
        const x1 = cell1.coordinates.x;
        const x2 = cell2.coordinates.x;
        const y1 = cell1.coordinates.y;
        const y2 = cell2.coordinates.y;

        return (Math.abs(x1 - x2) <= 1) && (Math.abs(y1 - y2) <= 1)
    }
}