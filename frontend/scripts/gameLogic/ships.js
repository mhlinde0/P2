

export class Ship {
    /** constuctor method creates a ship with following properties
     * @param {string} name - "destoryer", "submarine", "cruiser", "battliship", "carrier"
     * @param {number} length - how many fields  the ship take up
     * @param {string} rotation - either "vertical" or "horizontal"
     * @param {object|null} location - ships placement. Null means 'unplaced';
     */
    constructor(name, length, rotation, location) {
        this.name = name;
        this.length = length;
        this.rotation = rotation;
        this.location = location;
    }
}

const destroyer = new Ship("destroyer", 2, "vertical", null);
const submarine = new Ship("submarine", 3, "vertical", null);
const cruiser = new Ship("cruiser", 3, "vertical", null);
const battleship = new Ship("battleship", 4, "vertical", null);
const carrier = new Ship("carrier", 5, "vertical", null);

export const createShips = () => {
    const destroyer = new Ship("destroyer", 2, "vertical", null);
    const submarine = new Ship("submarine", 3, "vertical", null);
    const cruiser = new Ship("cruiser", 3, "vertical", null);
    const battleship = new Ship("battleship", 4, "vertical", null);
    const carrier = new Ship("carrier", 5, "vertical", null);
    return [destroyer, submarine, cruiser, battleship, carrier];
}


