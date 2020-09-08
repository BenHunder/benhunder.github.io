import Font from './Font.js';
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
            this.drawHealth(context);
            this.drawLevel(context);
            // this.drawLetters(context);
            this.drawAllyReadyCounter(context);
        }
    }

    //draws in the top left corner
    drawHealth(context){
        const string = 'health: ' + String(Math.floor(this.player.health));
        const x = this.margin;
        const y = this.margin;

        this.font.print(string, context, x, y);
    }

    //draws in the top right corner
    drawTimer(context){
        const string = 'time: ' + String(Math.floor(this.game.timer));
        const x = context.canvas.width - string.length * this.font.charWidth - this.margin;
        const y = context.canvas.height - this.font.charHeight - this.margin;

        this.font.print(string, context, x, y);
    }

    //draws in the bottom left corner
    drawLevel(context){
        const string = 'level: ' + String(this.game.level);
        const x = 10;
        const y = context.canvas.height - this.font.charHeight - this.margin;

        this.font.print(string, context, x, y);
    }

    drawLetters(context){
        const x = context.canvas.width/2;
        const y = context.canvas.height - this.font.charHeight - this.margin;

        this.font.printCentered(this.game.letters, context, x, y);
    }

    //draws in the bottom right corner
    drawAllyReadyCounter(context){
        const string = 'ally ready in: ' + String(this.player.allyReadyCounter);
        const x = context.canvas.width - string.length * this.font.charWidth - this.margin;
        const y = this.margin;

        this.font.print(string, context, x, y);
    }

    update(deltaTime){
        this.game.timer -= deltaTime;
    }
}