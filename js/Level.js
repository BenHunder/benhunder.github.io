export default class Level{
    constructor(cellMap, spawner){
        this.cellMap = cellMap;
        this.spawner = spawner;
    }

    draw(context){
        if(this.buffer){
            context.drawImage(this.buffer, 0, 0);
        }
        
        if(this.cells){
            this.cells.forEach(cell => {
                cell.draw(context);
            });
        }

    }

    update(deltaTime){
        if(this.cells){
            this.cells.forEach(cell => {
                cell.update(deltaTime);
            });
        }
    }

}