const PRESSED = 1;
const RELEASED = 0;

export default class Controller{
    constructor(canvas){
        this.canvas = canvas
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
            const x = event.clientX - gameCanvas.offsetLeft;
            const y = event.clientY - gameCanvas.offsetTop;
            if(event.type == "mousemove"){
                this.onMouseMove(x, y);
            }else{
                this.onClick(x, y);
            }
        }
    }

    listenTo(window){
        ['keydown', 'keyup', 'click', 'mousemove'].forEach(eventName => {
            window.addEventListener(eventName, event => {
                this.handleEvent(event);
            });
        });
    }

    onClick(x, y){
        console.log("click! (no click function defined");
    }

    onMouseMove(x, y){
        console.log("no hover function defined");
    }
}