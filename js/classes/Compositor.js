

export default class Compositor{
    constructor(){
        this.layers = [];
        this.level = null;  
        this.menu = null;    
        this.paused = false;  
    }

    draw(context) {
        if(this.level){
            const layers = level.cellMap.grid;
            layers.forEach(layer => {
                const cells = layer;
                cells.forEach(cell => {
                    cell.draw();
                });
            });
        }
    }

    drawMenu(context){
        this.menu.draw(context);
    }

    update(deltaTime){
        this.layers.forEach(layer => {
            layer.update(deltaTime)
        });
    }

    setMenu(menu){
        this.menu = menu;
        this.menu.selected = 0;
    }
    

}