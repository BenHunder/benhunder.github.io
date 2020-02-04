//this file is not really being used yet. I'm just saving some code here for now

const q = cellMap.get('q');
const f = cellMap.get('f');
const r = cellMap.get('r');
const m = cellMap.get('m');


log("above f: ", cellMap.above(f));
log("below f: ", cellMap.below(f));
log("left f: ", cellMap.left(f));
log("right f: ", cellMap.right(f));
log("lowerLeft f: ", cellMap.lowerLeft(f));
log("lowerRight f: ", cellMap.lowerRight(f));
log("upperLeft f: ", cellMap.upperLeft(f));
log("upperRight f: ", cellMap.upperRight(f));
log("q lowerRight: ", cellMap.lowerRight(q));
log("m left: ", cellMap.left(m));
log("m right: ", cellMap.right(m));
log("m below: ", cellMap.below(m));
log("q left: ", cellMap.left(q));
log("q cross: ", cellMap.cross(q));
log("q corners: ", cellMap.corners(q));
log("q and f are adjacent: ", cellMap.areAdjacent(q, f));
log("r and f are adjacent: ", cellMap.areAdjacent(r, f));