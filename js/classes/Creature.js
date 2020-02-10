
export default class Creature{
    constructor(spriteSheet, soundBoard){
        this.spriteSheet = spriteSheet;
        this.soundBoard = soundBoard;
        this.traits = [];
        
        this.isAnimating = false;
        this.currentFrame = 0;
        this.counter = 0;
    }

    addTrait(trait) {
        this.traits.push(trait);
        this[trait.NAME] = trait;
    }

    update(deltaTime){
        if(this.isAnimating){
            this.counter += deltaTime;
        }

        this.traits.forEach(trait => {
            trait.update(deltaTime);
        })
    } 

    //this is a temporary solution, should probably have separate classes or something for plants vs creatures or a class for each creature? i don't know yet
    // drawPlant(context, x, y){
    //     let i = 0;
    //     if(this.type === "plant"){
    //         i = (this.spriteSheet.size() - 1) - Math.floor((this.spriteSheet.size() * this.hunger)/(this.maxHunger));
    //         if (i > 5){
    //             i = 5;
    //         }
    //     }
    //     const name = 'frame' + i;
    //     const buffer = this.spriteSheet.getBuffer(name);
    //     context.drawImage(buffer, x, y);
    // }
    
    draw(context, x, y){
        let name = 'frame' + this.currentFrame;

        //advance frames
        if(this.isAnimating){
            if(this.counter >= this.spriteSheet.getDuration(name)/1000){
                this.counter = 0;
                this.currentFrame += 1;
                if(this.currentFrame > this.spriteSheet.size()-1){
                    this.currentFrame = 0;
                    this.isAnimating = false;
                }
            }
        }else{
            this.currentFrame = 0;
            this.counter = 0;
        }

        name = 'frame' + this.currentFrame;
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