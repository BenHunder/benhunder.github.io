export default class Level{
    constructor(backgroundBuffer, cellMap, spawner){
        this.backgroundBuffer = backgroundBuffer;
        this.cellMap = cellMap;
        this.spawner = spawner;
    }

    //don't know if level needs a draw and update yet
    // draw(context){     
    //     if(this.cells){
    //         this.cells.forEach(cell => {
    //             cell.draw(context);
    //         });
    //     }

    // }

    // update(deltaTime){
    //     if(this.cells){
    //         this.cells.forEach(cell => {
    //             cell.update(deltaTime);
    //         });
    //     }
    // }

}