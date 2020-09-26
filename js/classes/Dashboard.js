import Layer from './Layer.js';

export default class Dashboard extends Layer{
    constructor(zIndex, font, player, game){
        super(zIndex);
        this.font = font;

        this.margin = 10;

        this.player = player;
        this.game = game;
    }

    draw(context){
        if(this.game.level > 0){
            this.drawTimer(context);
            this.drawLevel(context);
            // this.drawLetters(context);
            this.drawEnergyMeter(context);
            this.drawASomething(context);
        }
    }

    //draws in the bottom left corner
    drawSomethingElse(context){
        const string = 'something: ' + String(Math.floor(42));
        const x = 10;
        const y = context.canvas.height - this.font.charHeight - this.margin;

        this.font.print(string, context, x, y);
    }

    //draws in the bottom right corner
    drawTimer(context){
        const string = 'time: ' + String(Math.floor(this.game.timer));
        const x = context.canvas.width - string.length * this.font.charWidth - this.margin;
        const y = context.canvas.height - this.font.charHeight - this.margin;
    }

    //draws in the top left corner
    drawLevel(context){
        const string = 'level: ' + String(this.game.level);
        const x = this.margin;
        const y = this.margin;

        this.font.print(string, context, x, y);
    }

    drawEnergyMeter(context){
        const x = 25;
        const y = context.canvas.height - 20;

        const barWidth = context.canvas.width - 50;

        //draw specials (which are only creature factories at the moment)
        this.player.creatureFactories.forEach( (special, i) => {
            const newCreature = special.create();
            const xCost = Math.ceil((special.cost / this.player.maxEnergy) * barWidth);
            //should probably get the correct value for these if variable sizes are needed
            const halfSpecialWidth = 16;
            const specialHeight = 32;
            newCreature.draw(context, x + xCost - halfSpecialWidth, y - specialHeight, 'still');

            //temporary way to indicate selected special
            if(i == this.player.specialSelection){
                context.lineWidth = 2;
                context.strokeStyle = "#D72727";
                context.beginPath();
                context.moveTo(x + xCost - 5, y - 6);
                context.lineTo(x + xCost + 5, y - 6);
                context.stroke();
            }
        });

        //draw meter
        const xEnergy = Math.ceil((this.player.energy / this.player.maxEnergy) * barWidth);

        context.strokeStyle = "#6ABE30";
        context.lineWidth = 10;
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x + xEnergy, y);
        context.stroke();

        if(xEnergy < barWidth){
            context.strokeStyle = "#302C2E";
            context.beginPath();
            context.moveTo(x + xEnergy, y);
            context.lineTo(x+barWidth, y);
            context.stroke();
        }
    }

    //draws in the top right corner
    drawASomething(context){
        const string = 'a something: ' + String(this.player.energy);
        const x = context.canvas.width - string.length * this.font.charWidth - this.margin;
        const y = this.margin;

        this.font.print(string, context, x, y);
    }

    update(deltaTime){
        this.game.timer -= deltaTime;
    }
}