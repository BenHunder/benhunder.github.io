export default class Game{
    constructor(){
        this.baseTimer = 20;

        this.cellMap = null;
        this.timer = this.baseTimer;
        this.level = 1;
    }

    reset(){
        this.timer = this.baseTimer;
    }
}