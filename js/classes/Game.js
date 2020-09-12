export default class Game{
    constructor(){
        this.baseTimer = 100;
        
        //change 
        this.level2 = null;
        this.timer = this.baseTimer;
        this.level = 0;
        this.letters = '';
    }

    addTime(amount){
        this.timer += amount;
    }

    subtractTime(amount){
        this.timer -= amount;
    }

    reset(){
        this.timer = this.baseTimer;
        //this.level = 0;
    }
}