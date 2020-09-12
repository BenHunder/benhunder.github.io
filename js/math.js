
export class Vec2 {
    constructor(x, y){
        this.set(x, y);
    }

    set(x, y){
        this.x = x;
        this.y = y;
    }
}

export function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

export function indicesToCoordinates(ivec){
    //TODO: move these offsets somewhere else!
    const xOff = 60;
    const yOff = 75;
    const x = ivec.x*32 + xOff + ((ivec.y%2) * 16);
    const y = ivec.y*21 + yOff;

    return {x, y}    
}

//TODO: do more testing on this function, it's mapping the image coordinates perfectly, but it might be more intuituve if the visible part of the tile is more closely mapped. would just need to add a constant or two into these equations I think
export function coordinatesToIndices(cvec){
    //TODO: move these offsets somewhere else!
    const xOff = 60;
    const yOff = 75;

    const y = Math.floor((cvec.y - yOff)/21);
    const x = Math.floor((cvec.x - xOff - ((y%2) * 16))/32);
    
    //console.log(`in: ${cvec.x}, ${cvec.y} out: ${x}, ${y}` )
    return {x, y}
}
