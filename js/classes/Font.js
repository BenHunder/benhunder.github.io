import SpriteSheet from './SpriteSheet.js'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890`~!@#$%^&*()_-+={}[]|\\:;"\'<,>.?/ '


//TODO: scaling is only working for two sizes, 1 and 0.5. Will have to store/load multiple sizes of a font if more sizes are needed.
export default class Font{
    constructor(image, name, charWidth, charHeight){

        this.spriteSheet = new SpriteSheet(image);
        this.name = name;
        this.charWidth = charWidth;
        this.charHeight = charHeight;
        this.rowLen = 26 * this.charWidth;

        for(let [index, char] of [...CHARS].entries()){
            const x = index * this.charWidth % this.rowLen;
            const y = Math.floor(index * this.charWidth / this.rowLen) * this.charHeight;

            this.spriteSheet.define(char, x, y, this.charWidth, this.charHeight);            
        }
    }

    print(text, context, x, y, scale=1){
        [...text].forEach((char, index) => {
            this.draw(char, context, x + index * this.charWidth * scale, y, scale);
        });
    }

    printCentered(text, context, x, y, scale=1){
        const width = text.length * this.charWidth;
        const xStart = x - width/2; 
        [...text].forEach((char, index) => {
            this.draw(char, context, xStart + index * this.charWidth * scale, y, scale);
        });
    }

    draw(char, context, x, y, scale){
        context.drawImage(this.spriteSheet.getBuffer(char), x, y, this.charWidth * scale, this.charHeight * scale);
    }
}
