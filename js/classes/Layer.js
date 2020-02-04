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

        console.log("cells of : " + this.zIndex);
        console.log({cells});
        if(this.cells){
            this.cells.forEach(cell => {
                console.log("cell:");
                console.log({cell});
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