export default class SpriteSheet{
    constructor(image){
        this.image = image;
        this.tiles = new Map();
        this.durations = new Map();
    } 

    define(name, x, y, width, height, duration){
        let buffer = document.createElement('canvas');
        buffer.width = width;
        buffer.height = height;
        buffer.getContext('2d').drawImage(
            this.image, 
            x,
            y,
            width,
            height,
            0,
            0,
            width,
            height); 
        this.tiles.set(name, buffer);
        this.durations.set(name, duration);
    }

    size(){
        return this.tiles.size;
    }

    getDuration(name){
        return this.durations.get(name);
    }

    getBuffer(name){
        return this.tiles.get(name);
    }
}