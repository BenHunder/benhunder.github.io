const PRESSED = 1;
const RELEASED = 0;

export default class Controller{
    constructor(){
        this.keyStates = new Map();
        this.keyMap = new Map();
    }

    setMapping(keyCode, callback){
        this.keyMap.set(keyCode, callback);
    }

    handleEvent(event){
        let {keyCode} = event;

        if(keyCode){
            if(!this.keyMap.has(keyCode)){
                return;
            }

            event.preventDefault();
            const keyState = event.type === 'keydown' ? PRESSED : RELEASED;
            if(keyState === this.keyStates.get(keyCode)){
                return;
            }

            this.keyStates.set(keyCode, keyState);

            this.keyMap.get(keyCode)(keyState);
        }else{
            this.onClick(event.layerX, event.layerY);
        }
    }

    listenTo(window){
        ['keydown', 'keyup', 'click'].forEach(eventName => {
            window.addEventListener(eventName, event => {
                this.handleEvent(event);
            });
        });
    }

    onClick(x, y){
        console.log("default");
    }
}