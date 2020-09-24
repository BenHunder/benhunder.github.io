import Weapon from './Weapon.js';
import { globalSoundBoard, tileSheet } from '../main.js';

export default class Cell{
    constructor(name, indices, coordinates, terrain){

        this.name = name;
        this.indices = indices;
        this.coordinates = coordinates;

        this.hitTimer = 0;
        this.trailTime = 1;

        this.depth = 50;
        this.maxDepth = 50;
        this.speed = 50;
        this.duringSinkingAnimation = false;
        this.sinkDelay = 0;
        this.isActive = false;
        this.isHovered = false;
        this.isProtected = false;
        this.creature = null;

        this.terrain = terrain;
        this.status = "frozen"
    }


    attack(amount){
        let remainingHealth = 1;
        if(!this.duringSinkingAnimation && !this.isProtected){
            globalSoundBoard.play('bonkEnemy');
            remainingHealth = this.creature.damage(amount);
        }

        return remainingHealth;
    }
    //kill creature, the player is passed as an argument so their score will be increased
    //todo: added the default player just to make achilia work, revist score later
    kill(){
        if(!this.duringSinkingAnimation){
            this.creature.playSound('kill', 80);
            const delay = this.creature.kill();

            if(delay === 0){
                this.duringSinkingAnimation = true;
            }else if( delay > 0){
                this.sinkDelay = delay;
                this.duringSinkingAnimation = true;
            }else{
                //negative delay here is a special case where the cell shouldn't sink or die after the creature was killed. If killing a creature would replace it with another creature for example, that kill function should return a negative delay
            }
        }
    }
    
    
    update(deltaTime){
        //spawn animation
        if(this.isActive && (!this.duringSinkingAnimation) && (this.depth != 0)){
            if(this.depth < 0.5 && this.depth > -0.5){
                this.depth = 0;
            }else if(this.depth > 0){
                this.depth -= this.speed * deltaTime;
            }else{
                this.depth += this.speed * deltaTime;
            }
            
        }

        //attack animation
        if(this.creature && this.creature.health <= 0){
            this.kill();
        }
        if(this.sinkDelay >= 0){
            this.sinkDelay -= deltaTime;
        }else{
            if(this.duringSinkingAnimation && this.depth < this.maxDepth){
                this.depth += this.speed * deltaTime;
            }else if(this.duringSinkingAnimation && this.depth >= this.maxDepth){
                this.duringSinkingAnimation = false;
                this.reset();
            }
        }

        this.isProtected = false;

        if(this.hitTimer > 0){
            this.hitTimer -= deltaTime;
        }else{
            this.hitTimer = 0;
        }
    }

    interact(item, player){
        this.hitTimer = this.trailTime;
        if(this.isActive){
            if(item instanceof Weapon && player.ammo > 0){
                this.attack(item.power);
                return {"result": "attacked", "creatureName": this.creature.name};
            }
        }else{
            globalSoundBoard.play('bonkOther');
            //player.damage(1);
            const special = player.selectedSpecial();
            if(player.energy >= special.cost){
                const newCreature = special.create();
                this.spawnNew(newCreature);
                player.energy -= special.cost + 1;
                return {"result": "spawned", "creatureName": this.creature.name};
            }else{
                return {"result": "nothing", "cell": null};
            }
        }
    }

    pressed(){
    }

    released(){
        if(this.creature){
            //this.creature.isHeld = false;
        }
    }

    spawnNew(creature){
        if(this.isSpawnable()){
            creature.currentCell = this;
            this.creature = creature;
            if(creature.name == "asteroid" || creature.name == "outpost"){
                this.speed = 200;
                this.depth = -300;
            }
            this.isActive = true;
        }else{
            if(this.creature){
                console.log("tried to spawn a " + creature.name + " on active cell " + this.name + " which already contained " + this.creature.name);
            }else{
                console.log("tried to spawn a " + creature.name + " on a non-spawnable cell " + this.name);
            }
        }
    }

    isSpawnable(){
        return !this.isActive && this.terrain != "water" && this.terrain != "mountain" && this.terrain != "outpost"
    }

    moveTo(creature){
        const fromCell = creature.currentCell;
        fromCell.reset();

        creature.currentCell = this;
        this.creature = creature;
        this.depth = 0;
        this.isActive = true;
    }

    teleport(creature){
        if(!this.isActive){
            this.creature = creature;
            this.depth = 0;
            this.isActive = true;
        }else{
            console.log("tried to teleport on active cell");
        }
    }

    reset(){
        this.depth = 50;
        this.maxDepth = 50;
        this.speed = 50;
        this.hitTimer = 0;
        this.duringSinkingAnimation = false;
        this.isActive = false;
        this.isHovered = false;
        this.isProtected = false;
        this.creature = null;
    };



    draw(context){
        // if(this.depth < this.maxDepth){
            this.drawTerrain(context);

            if(this.creature){
                this.drawStatus(context);
            }

            this.drawMouseFrame(context);

            if(this.creature){
                this.drawCreature(context);
            }
    }

    drawTerrain(context){
        try{
            context.drawImage(tileSheet.getBuffer(this.terrain), this.coordinates.x, this.coordinates.y + (this.isActive?Math.ceil(this.depth):0));
        }catch(err){
            console.log("error on ", this.terrain);
        }
    }

    drawStatus(context){
        //draw frame
        context.drawImage(tileSheet.getBuffer('standard2'), this.coordinates.x, this.coordinates.y + Math.ceil(this.depth));

        //draw status conditions
        if(this.status === "frozen"){
            context.globalAlpha = 0.25;
            context.drawImage(tileSheet.getBuffer('frozen'), this.coordinates.x, this.coordinates.y + Math.ceil(this.depth));
            context.globalAlpha = 1;
        }

        //draw healthbar.
        const x = this.coordinates.x + 10;
        const y = this.coordinates.y + 27;

        const xHealth = Math.ceil((this.creature.health / this.creature.maxHealth) * 12);

        if(xHealth < 5){
            context.strokeStyle = "#D72727";
        }else{
            context.strokeStyle = "#6ABE30";
        }
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(x, y + Math.ceil(this.depth));
        context.lineTo(x + xHealth, y + Math.ceil(this.depth));
        context.stroke();

        if(xHealth < 12){
            context.strokeStyle = "#302C2E";
            context.beginPath();
            context.moveTo(x + xHealth, y + Math.ceil(this.depth));
            context.lineTo(x+12, y + Math.ceil(this.depth));
            context.stroke();
        }

    }

    drawMouseFrame(context){

        if(this.isHovered){
            context.drawImage(tileSheet.getBuffer('wireframe5'), this.coordinates.x, this.coordinates.y + (this.isActive?Math.ceil(this.depth):0));
        }
        if(this.hitTimer > 0){
            context.globalAlpha = this.hitTimer;
            // context.drawImage(this.hitBuffer, 0, Math.ceil(this.depth));
            context.drawImage(tileSheet.getBuffer('wireframe4'), this.coordinates.x, this.coordinates.y + (this.isActive?Math.ceil(this.depth):0));
            context.globalAlpha = 1;
        }
    }

    //provides indices so it appears that the sprite is standing in the coordinates of the tile using the sprites dimensions
    //TODO is this where the animation frame name would be passed in?
    drawCreature(context){
        //adjust where the creature should be on the cell
        const yOffset = 0;
        const xOffset = 0;

        //TODO: once board is set, this should draw in the lower left corner of each cell
        // const x = Math.ceil(this.coordinates.x) - this.creature.width/2 + xOffset;
        // const y = Math.ceil(this.coordinates.y) + Math.ceil(this.depth) - this.creature.height + yOffset;
        const x = this.coordinates.x;
        const y = this.coordinates.y;

        if(this.isProtected){
            context.strokeStyle = '#008000';  // some color/style
            context.lineWidth = 2;         // thickness
            context.strokeRect(x, y, 32, 32);
        }
        this.creature.draw(context, x, y + Math.ceil(this.depth));
    }
}