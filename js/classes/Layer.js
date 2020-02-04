export default class Layer{
    constructor(zIndex, buffer, cells){
        this.zIndex = zIndex;
        this.buffer = buffer;
        this.cells = cells;
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