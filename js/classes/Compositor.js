

export default class Compositor{
    constructor(){
        this.layers = [];
        this.level = null;  
        this.dashboard = null;
        this.menu = null;    
        this.paused = false;  
    }

    draw(context) {
        if(this.level){
            this.drawLevel(context);
        }
        if(this.dashboard){
            this.drawDashboard(context);
        }
        if(this.paused){
            this.drawMenu(context);
        }
    }

    drawLevel(context){
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

    drawDashboard(context){
        this.dashboard.draw(context);
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

        if(this.dashboard){
            this.dashboard.update();
        }
    }

    setMenu(menu){
        this.menu = menu;
        this.menu.selected = 0;
    }
    

}