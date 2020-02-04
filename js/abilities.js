export const multiply = (creature) => ({
    multiply: function multiply(cellMap, currentCell){
        const pattern = "right";

        const newCell = cellMap[pattern](currentCell);
        //TODO create cell.spawn function which does nothing or throws an error if the cell is already active,
        if(newCell){
            newCell.spawnNew(this.creatureFactory.create());
        }
    }.bind(creature)
})

//TODO: test
export const teleport = (creature) => ({
    teleport: function teleport(cellMap, currentCell){
        const newCell = cellMap.randomAvailableCell();
        currentCell.reset();
        newCell.teleport(this);
    }.bind(creature)
})

export const attack = (creature) => ({
    attack: function attack(entity){
        entity.damage(this.attackPower);
    }.bind(creature)
})