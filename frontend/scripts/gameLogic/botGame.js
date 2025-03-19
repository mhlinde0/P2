import { randomizeShipPlacement, resetShipPlacement, createBoards } from './game.js';
import { getElementById, querySelectorAll } from '../utility/helperFunctions.js';

/** Represents a ship.* 
 * @class */
class Ship {
    /** constuctor method creates a ship with following properties
     * @param {string} name - "destoryer", "submarine", "cruiser", "battliship", "carrier"
     * @param {number} length - how many squares the ship take up
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



/** Array of ship div elements
 * @type {Array<Ship>} */
const shipsClass = [destroyer, submarine, cruiser, battleship, carrier];

/** Array of ship div elements 
 * @type {Array<HTMLElement>} */
const shipsDiv = querySelectorAll(".ship");

/** Array of squares that are filled by ships 
 *  @type {Array<HTMLElement>}  */
const occupiedSquareArrayLeft = [];

/** Array of squares that are filled by ships 
 *  @type {Array<HTMLElement>}*/
const occupiedSquareArrayRight = [];

/** Array of squares that are filled by ships 
 *  @type {Array<HTMLElement>}  */
const leftSquareArray = [];

/** Array of squares that are filled by ships 
 *  @type {Array<HTMLElement>}  */
const rightSquareArray = [];

let targetList = createTargetList()
let enemyHits = 0;
let ownHits = 0;
let battleBegun = 0;
let turn = 1;

initializeBotGame(); // starts bot game



function createTargetList() {
    let targetList = [];
    for (let i = 1; i <= 100; i++) {
        targetList.push(i);
    }
    console.log(targetList);
    return targetList
}

function botFireCannon() {

    const firedAtSquare = getElementById(`leftsquare${getNextRandomTarget()}`);

    if (rightSquareArray.includes(firedAtSquare)) {
        alert("bot should not fire at its own board");
        return;
    }
    else if (occupiedSquareArrayLeft.includes(firedAtSquare)) {
        firedAtSquare.classList.remove("occupiedSquare");
        firedAtSquare.classList.add("hitSquare");
        console.log("Hit shot");
        enemyHits += 1;
    }
    else {
        firedAtSquare?.classList.add("missedSquare");
        console.log("Missed shot");
    }
    turn = 1;
    gameLoop();
    console.log("Bot fired at:", firedAtSquare?.id);
}

function getNextRandomTarget() {
    const randomIndex = Math.floor(Math.random() * targetList.length);
    const randomTarget = targetList[randomIndex];
    targetList.splice(randomIndex, 1);

    return randomTarget;
}

function checkWinCondition() {
    if (enemyHits === 17) {
        return 1;
    }
    else if (ownHits === 17) {
        return 2;
    }

}

if (turn == 0) {
    console.log("test")
    botFireCannon();
    turn = 1;
}

function gameLoop() {
    if (checkWinCondition() === 1) {
        alert("The bot won!");
    }
    else if (checkWinCondition() === 2) {
        alert("You have won!");
    }
    if (turn === 0) {
        console.log("Bot's Turn");
        botFireCannon();
    } else {
        console.log("Player's Turn");
    }
}

function initializeBotGame() {
    createBoards();
    randomizeShipPlacement("right");
    gameLoop();
}

function removeButtonEventListener() {
    getElementById("resetButton").removeEventListener("click", resetShipPlacement);
    getElementById("randomizeButton").removeEventListener("click", () => randomizeShipPlacement("left"));
}