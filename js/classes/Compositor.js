

export default class Compositor{
    constructor(){
        this.layers = [];
        this.level = null;  
        this.menu = null;    
        this.paused = false;  
    }

    draw(context) {
        if(this.level){
            //draw level's background
            context.drawImage(this.level.backgroundBuffer, 0, 0);

            //draw all cells
            const layers = this.level.cellMap.grid;
            layers.forEach(layer => {
                const cells = layer;
                cells.forEach(cell => {
                    cell.draw(context);
                });
            });
        }
    }

    drawMenu(context){
        this.menu.draw(context);
    }

    update(deltaTime){
        if(this.level){
            const layers = this.level.cellMap.grid;
            layers.forEach(layer => {
                const cells = layer;
                cells.forEach(cell => {
                    cell.update(deltaTime);
                });
            });
        }
    }

    setMenu(menu){
        this.menu = menu;
        this.menu.selected = 0;
    }
    

}