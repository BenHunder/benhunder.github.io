import Attack from './traits/Attack.js';
import Feed from './traits/Feed.js';
import Spawn from './traits/Spawn.js';
import Weapon from './Weapon.js';
import Food from './Food.js';
import { globalSoundBoard, cellMap, tileSheet } from '../main.js';
import { Vec2 } from '../math.js';

export default class Cell{
    constructor(name, coordinates, center, normalBuffer, hitBuffer){

        this.name = name;
        this.coordinates = coordinates;
        this.center = center
        this.normalBuffer = normalBuffer;
        this.hitBuffer = hitBuffer;
        this.buffer = normalBuffer;

        this.hitTimer = 0;
        this.trailTime = 1;

        this.depth = 50;
        this.maxDepth = 50;
        this.speed = 50;
        this.duringSinkingAnimation = false;
        this.isActive = false;
        this.isProtected = false;
        this.creature = null;

        this.status = "frozen"

        this.traits = [];

        this.addTrait(new Attack(this));
        this.addTrait(new Feed(this));
        this.addTrait(new Spawn(this));
        
    }

    //TODO if draw coordinates aren't whole numbers the tile/sprites will look blurry. using math.ceil here to avoid that, but I wonder if there is a better solution
    draw(context){
        // if(this.depth < this.maxDepth){
        if(true){
            if(this.hitTimer > 0){
                context.globalAlpha = this.hitTimer;
                context.drawImage(this.hitBuffer, 0, Math.ceil(this.depth));
                context.globalAlpha = 1;
            }else{
                // context.drawImage(this.normalBuffer, this.center.x, this.center.y + Math.ceil(this.depth));
                context.drawImage(this.normalBuffer, this.center.x, this.center.y);
            }

            if(this.creature){
                this.drawStatus(context);
                this.drawCreature(context);
            }
        }else if(this.hitTimer > 0){
            context.globalAlpha = this.hitTimer;
            context.drawImage(this.hitBuffer, 0, 0);
            context.globalAlpha = 1;
        }
        //context.fillText(this.name, this.center.x - 20, this.center.y + 10);
    }

    drawTerrain(){

    }

    drawStatus(context){
        //draw frame
        context.drawImage(tileSheet.getBuffer('standard2'), this.center.x, this.center.y);

        //draw status conditions
        if(this.status === "frozen"){
            context.globalAlpha = 0.25;
            context.drawImage(tileSheet.getBuffer('frozen'), this.center.x, this.center.y);
            context.globalAlpha = 1;
        }

        //draw healthbar.
        const x = this.center.x + 10;
        const y = this.center.y + 27;

        const xHealth = Math.ceil((this.creature.health / this.creature.maxHealth) * 12);
        if(xHealth > 0){
            if(xHealth < 10){
                context.strokeStyle = "#AC3232";
            }else{
                context.strokeStyle = "#6ABE30";
            }
            context.lineWidth = 2;
            context.beginPath();
            context.moveTo(x, y);
            context.lineTo(x + xHealth, y);
            context.stroke();
        }

    }

    //provides coordinates so it appears that the sprite is standing in the center of the tile using the sprites dimensions
    //TODO is this where the animation frame name would be passed in?
    drawCreature(context){
        //adjust where the creature should be on the cell
        const yOffset = 0;
        const xOffset = 0;

        //TODO: once board is set, this should draw in the lower left corner of each cell
        // const x = Math.ceil(this.center.x) - this.creature.width/2 + xOffset;
        // const y = Math.ceil(this.center.y) + Math.ceil(this.depth) - this.creature.height + yOffset;
        const x = this.center.x;
        const y = this.center.y;

        if(this.isProtected){
            context.strokeStyle = '#008000';  // some color/style
            context.lineWidth = 2;         // thickness
            context.strokeRect(x, y, 32, 32);
        }
        this.creature.draw(context, x, y);
    }
    
    update(deltaTime){
        this.traits.forEach(trait => {
            trait.update(deltaTime);
        });
        this.isProtected = false;

        if(this.hitTimer > 0){
            this.hitTimer -= deltaTime;
        }else{
            this.hitTimer = 0;
        }
    }

    addTrait(trait){
        this.traits.push(trait);
        this[trait.NAME] = trait;

    }

    //routes to appropriate trait based on held item and cell state, then damages player if an inactive cell is pressed or adds score if a creature is killed
    interact(item, player){
        this.hitTimer = this.trailTime;
        if(this.isActive){
            if(item instanceof Weapon && player.ammo > 0){
                this.creature.isHeld = true;
                this.attack.start(item, player);
                return this.creature.name;
            }else if(item instanceof Food){
                this.feed.start(item, player);
            }
        }else{
            globalSoundBoard.play('bonkOther');
            //player.damage(1);
            if(player.allyReadyCounter == 0){
                const newCreature = player.creatureFactories[0].create();
                this.spawnNew(newCreature);
                player.allyReadyCounter = 20;
            }
        }
    }

    pressed(){
    }

    released(){
        if(this.creature){
            this.creature.isHeld = false;
        }
    }

    spawnNew(creature){
        if(!this.isActive){
            creature.currentCell = this;
            this.creature = creature;
            this.spawn.start();
        }else{
            console.log("tried to spawn on active cell");
        }
    }

    replace(creature){
        if(this.isActive){
            creature.currentCell = this;
            this.creature = creature; 
        }else{
            console.log("tried to replace an inactive cell");
        }
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
        this.isProtected = false;
        this.creature = null;
    };
}