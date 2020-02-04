export default class Compositor{
    constructor(){
        this.layers = [];  
        this.menu = null;    
        this.paused = false;  
    }

    draw(context) {
        this.layers.forEach(layer => {
            layer.draw(context);
        })
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