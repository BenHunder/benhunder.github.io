
export default class Creature{
    constructor(spriteSheet, soundBoard){
        this.spriteSheet = spriteSheet;
        this.soundBoard = soundBoard;
        this.traits = [];
    }

    addTrait(trait) {
        this.traits.push(trait);
        this[trait.NAME] = trait;
    }

    update(deltaTime){
        this.traits.forEach(trait => {
            trait.update(this, deltaTime);
        })
    } 

    //this is a temporary solution, should probably have separate classes or something for plants vs creatures or a class for each creature? i don't know yet
    draw(context, x, y){
        let i = 0;
        if(this.type === "plant"){
            i = (this.spriteSheet.size() - 1) - Math.floor((this.spriteSheet.size() * this.hunger)/(this.maxHunger));
            if (i > 5){
                i = 5;
            }
        }
        const name = 'frame' + i;
        const buffer = this.spriteSheet.getBuffer(name);
        context.drawImage(buffer, x, y);
    }
    
    playSound(name, delay=0){
        if(this.soundBoard.hasSound(name)){
            this.soundBoard.play(name, delay);
        }else{
            console.log(name + " sound missing");
        }
    }
}