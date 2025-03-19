/** @module game */

import { User, setUser } from '../utility/state.js';
import { setBanner } from '../utility/ui.js';
import { getElementById, querySelectorAll } from '../utility/helperFunctions.js';

















const apiBase = '/';

const gameBoardWrapper = getElementById("gameBoardWrapper");


/** Board width in squares
 * @type {number} */
const boardWidth = 10;

/** Board length in squares
 * @type {number} */
const boardHeight = 10;


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

// Sets a timer that calls checkGameStatus every 1 seconds
const checkGameStatusTimer = setInterval(checkGameStatus, 1000);

// Sets time that calls checkCurrentTurn
const checkCurrentTurnTimer = setInterval(checkCurrentTurn, 1000);
let firedShots = [];

let currentHoveredShip = null;

let turn = 1;
let battleBegun = 0;
let enemyHits = 0;
let ownHits = 0;


/** Creates 2 game boards
 * @function
 */
export function createBoards() {
    const leftGameBoardWrapper = document.createElement("div");
    leftGameBoardWrapper.classList.add("gameBoard");

    gameBoardWrapper.append(leftGameBoardWrapper);
    createSquares(leftGameBoardWrapper, "left");

    const rightGameBoardWrapper = document.createElement("div");
    rightGameBoardWrapper.classList.add("gameBoard");

    gameBoardWrapper.append(rightGameBoardWrapper);
    createSquares(rightGameBoardWrapper, "right");

}


/** Creates 100 squares to fill the game boards and adds drag and drop functionalty to them
 * @function
 * @param {HTMLElement} gameboard
 * @param {"left"|"right"} side
 */
function createSquares(gameboard, side) {
    for (let i = 0; i < boardWidth * boardHeight; i++) {
        const square = document.createElement("div");
        square.classList.add("square");
        square.classList.add(side);

        square.id = side + "square" + (i + 1);

        if (side === "left") {
            leftSquareArray.push(square);
        } else {
            rightSquareArray.push(square);
        }

        square.dataset.side = side;
        square.dataset.index = String(i + 1);

        // Tilføjer nødvendige e listeners til alle squares når de bliver lavet
        square.addEventListener("dragover", (e) => {
            e.preventDefault();
        })

        square.addEventListener("drop", onShipDrop);

        square.addEventListener("click", fireCannon);

        // Tilføjer square div til gameboard div
        gameboard.append(square);
    }
}

/** handles ship drop event
 * @function
 */
function onShipDrop(e) {
    e.preventDefault();

    const square = e.currentTarget;
    const side = square.dataset.side;
    const shipId = e.dataTransfer.getData("text/plain"); // text/plain fortæller at dataen vi leder efter er ren tekst
    const draggedShipElement = getElementById(shipId);
    let draggedShip = null;



    // finder hvilken class ship vi skal bruge ud fra html elementet
    if (draggedShipElement.id === "destroyerSize2") {
        draggedShip = destroyer;
    } else if (draggedShipElement.id === "submarineSize3") {
        draggedShip = submarine;
    } else if (draggedShipElement.id === "cruiserSize3") {
        draggedShip = cruiser;
    } else if (draggedShipElement.id === "battleshipSize4") {
        draggedShip = battleship;
    } else if (draggedShipElement.id === "carrierSize5") {
        draggedShip = carrier;
    }

    if (!draggedShip) {
        throw new Error("Couldn't handle ship draggin properly");
    }

    const droppedSquare = parseInt(square.dataset.index, 10);
    const draggedShipLength = draggedShip.length;
    const draggedShipRotation = parseInt(draggedShipElement.getAttribute("data-rotation") || "0", 10); // Finder skibets nuværende rotation ved at finde attributen "data-rotation" og give den som en int

    const startColumn = (droppedSquare - 1) % boardWidth;
    const startRow = Math.floor((droppedSquare - 1) / boardWidth);

    let coveredSquares = [];

    if (checkForBoardSide(side)) {
        alert("Cannot place ships on opponent's board");
        return;
    }

    if (draggedShipRotation % 180 === 0) { // Hvis % 180 === 0 er sandt betyder det at skibet er lodret 
        if (checkForOutOfBounds(startRow, startColumn, draggedShipLength, draggedShipRotation)) {
            alert("Ship is out of bounds.");
            return;
        }
        for (let j = 0; j < draggedShipLength; j++) { // Hvis skibet kan være der bliver felterne placeret i arrayet
            coveredSquares.push(droppedSquare + j * boardWidth);
        }
    } else { // Hvis det ikke er sandt % 180 === 0 betyder det at skibet er vandret
        if (checkForOutOfBounds(startRow, startColumn, draggedShipLength, draggedShipRotation)) {
            alert("Ship is out of bounds.");
            return;
        }
        for (let j = 0; j < draggedShipLength; j++) {
            coveredSquares.push(droppedSquare + j);
        }
    }

    if (checkForOverlap(coveredSquares, side)) {
        alert("Ship overlaps another ship.");
        return;
    }

    draggedShip.rotation = String(draggedShipRotation);
    draggedShip.location = {
        startSquare: droppedSquare,
        coveredSquares: coveredSquares
    };

    draggedShipElement.style.display = "none"; // Gør html elementet usynligt når skibet bliver placeret

    assignOccupiedSquares(coveredSquares, side);
    if (occupiedSquareArrayLeft.length === 17) {
        battleBegun = 1;
        removeButtonEventListener();
    }
    console.log(occupiedSquareArrayLeft)
}


/** Checks if the ship is out of the board bounds
 * @function
 */
function checkForOutOfBounds(startRow, startColumn, shipLength, rotation) {
    if (rotation % 180 === 0) { // Hvis lodret
        return (startRow + shipLength > boardHeight);
    } else { // Hvis vandret
        return (startColumn + shipLength > boardWidth);
    }
}


/** Checks what board the player is trying to place ships on
 * @function
 */
function checkForBoardSide(side) {
    if (side === "right") {
        return true;
    }
    return false;
}

/** checks if there already are any ships on the squares
 * @function
 * @param {any} coveredSquares
 * @param {"left"|"right"} side - side is either "left" or right
 */
function checkForOverlap(coveredSquares, side) {
    const occupiedArray = side === "left" ? occupiedSquareArrayLeft : occupiedSquareArrayRight;

    for (let i = 0; i < coveredSquares.length; i++) {
        const squareElement = getElementById(side + "square" + (coveredSquares[i]));
        if (occupiedArray.includes(squareElement)) {
            return true;
        }
    }
    return false;
}

/** Tilføjer elementet occupiedSquare til de squares med skibe på
 * @function
 */
function assignOccupiedSquares(coveredSquares, side) {
    coveredSquares.forEach(index => {
        const squareElement = getElementById(side + "square" + (index));
        if (squareElement) {
            squareElement.classList.add("occupiedSquare");
            if (side === "left") {
                occupiedSquareArrayLeft.push(squareElement);
            } else if (side === "right") {
                occupiedSquareArrayRight.push(squareElement);
            }
        }
    });
}

shipsDiv.forEach(ship => {
    ship.addEventListener("dragstart", (e) => {
        let cloneImageShip = ship.cloneNode(true);
        if (cloneImageShip instanceof HTMLElement) {

            // Sætter skibet rotation (transform) til klonens
            const style = getComputedStyle(ship);
            cloneImageShip.style.transform = style.transform

            // Placerer klonen så den ikke er synlig

            cloneImageShip.style.position = "absolute";
            cloneImageShip.style.top = "-2000px";
            cloneImageShip.style.left = "-2000px";

            document.body.appendChild(cloneImageShip);

            // Sætter klonen til at være drag image
            if (e.dataTransfer !== null) {
                e.dataTransfer.setDragImage(cloneImageShip, 0, 0);
                e.dataTransfer.setData("text/plain", ship.id);
            }
            // Fjerne klonen efter e queuen (timeren er sat til 0 millisekunder)
            setTimeout(() => {
                document.body.removeChild(cloneImageShip);
            }, 0);
        }

    })
})


// Select a ship when hovered
shipsDiv.forEach((ship) => {
    ship.addEventListener("mouseover", (e) => {
        currentHoveredShip = ship;
    });

    ship.addEventListener("mouseout", (e) => {
        currentHoveredShip = null;
    })
});

// Rotate ship when pressing r
document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "r" && currentHoveredShip) {
        console.log(currentHoveredShip.getAttribute('id'))
        let currentRotation = parseInt(currentHoveredShip.getAttribute("data-rotation") || "0", 10);
        let newRotation = (currentRotation + 90) % 360;
        currentHoveredShip.style.transform = "rotate(" + newRotation + "deg)";
        currentHoveredShip.setAttribute("data-rotation", newRotation);
    }
});

/** 
 * @function
 */
export function resetShipPlacement() {
    // Finder alle left elementer og fjerner occupiedSquare classen hvis de har den
    const squares = querySelectorAll(".left")
    squares.forEach((square) => square.classList.remove("occupiedSquare"));

    occupiedSquareArrayLeft.length = 0;

    // Finder elementer med class "ship" og gør dem synlige igen og fjerne rotation)
    const ships = querySelectorAll(".ship");
    for (let i = 0; i < ships.length; i++) {
        ships[i].style.display = "block";
        ships[i].style.transform = "rotate(0deg)";
        ships[i].setAttribute("data-rotation", "0");
    }
}

/** skriv
 * @function
 */
export function randomizeShipPlacement(boardSide) {
    resetShipPlacement();

    // Går over arrayet af ship classes for at placere alle skibene
    shipsClass.forEach(ship => {
        let placed = false;

        while (!placed) {
            // Sætter skibets rotation til 0 hvis et tilfældigt tal fra 0-1 er mindre en 0.5
            let rotation = Math.random() < 0.5 ? 0 : 90;

            let row = Math.floor(Math.random() * boardHeight);
            let col = Math.floor(Math.random() * boardWidth);

            if (checkForOutOfBounds(row, col, ship.length, rotation)) continue; // Prøver en ny position

            let droppedSquare = row * boardWidth + col + 1;
            let coveredSquares = [];

            if (rotation % 180 === 0) {
                for (let j = 0; j < ship.length; j++) { // Lodret placering
                    coveredSquares.push(droppedSquare + j * boardWidth);
                }
            } else {
                for (let j = 0; j < ship.length; j++) { // Vandret placering
                    coveredSquares.push(droppedSquare + j);
                }
            }

            if (checkForOverlap(coveredSquares, boardSide)) {
                continue;
            }

            assignOccupiedSquares(coveredSquares, boardSide);

            ship.rotation = String(rotation);
            ship.location = {
                startSquare: droppedSquare,
                coveredSquares: coveredSquares
            };

            if (boardSide === "left") {
                // Finder skibets id og gemmer elementet når placeret
                const shipElement = getElementById(ship.name + "Size" + ship.length);
                shipElement.style.display = "none";
            }

            placed = true;
        }
    })
    console.log(boardSide === "left" ? occupiedSquareArrayLeft : occupiedSquareArrayRight);
    if (boardSide === "left") {
        battleBegun = 1;
        removeButtonEventListener();
    }
}

/**
 * Update the game state on the backend with the player's board and ready status.
 *
 * @param {string} userId - The current user's ID.
 * @param {object} ships - The ships object including name, length, rotation and location
 * @param {array} shots - Array of shots fired by the user
 * @param {boolean} ready - The readiness flag.
 * @returns {Promise<object>} - The updated game data from the backend.
 */
export async function updateGameState(userId, ships, shots, ready) {
    // Retrieve the gameId from sessionStorage
    const gameId = sessionStorage.getItem("gameId");
    console.log("Game ID from sessionStorage:", gameId);
    if (!gameId) {
      console.error("Game ID not found in session storage");
      return;
    }
  
    try {
      const response = await fetch(`/game`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, userId, ships, shots, ready })
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const updatedGame = await response.json();
      console.log("Game updated successfully:", updatedGame);
      return updatedGame;
    } catch (error) {
      console.error("Error updating game:", error);
      throw error;
    }
  }

  const readyButton = document.getElementById("readyButton");
  readyButton?.addEventListener("click", () => {
    const userId = User()._id;

    const ships = shipsClass.map(ship => ({
      name: ship.name,
      length: ship.length,
      rotation: ship.rotation,
      location: ship.location
    }));
  
    const shots = firedShots;
  
    updateGameState(userId, ships, shots, true);
  });

  // Checks for game status
async function checkGameStatus() {
    const gameId = sessionStorage.getItem('gameId');
    if (!gameId) return;
  
    try {
    // Fetch from the dedicated endpoint
    const response = await fetch(`/game/data?gameId=${gameId}`);
    if (!response.ok) throw new Error(`Server error: ${response.status}`);
      
    const gameData = await response.json();

    if (gameData.status === 'active') {
        hideBanner();
        clearInterval(checkGameStatusTimer); // Removes the timer if game status is active
    }
    } catch (error) {
        console.error("Error checking game state:", error);
    }
}

async function checkCurrentTurn() {
    const gameId = sessionStorage.getItem('gameId');
    const userId = User()._id;
    if (!gameId) return;

    try {
        const response = await fetch(`/game/data?gameId=${gameId}`);
        if (!response.ok) throw new Error(`Server error: ${response.status}`);

        const gameData = await response.json();

        if (gameData.currentTurn === userId) {
            turn = 1;
            clearInterval(checkCurrentTurnTimer);
        }
    } catch (error) {
        console.error("Error checking game state:", error);
    }



}

function fireCannon(e) {
    if (battleBegun === 1) {
      const firedAtSquare = e.currentTarget;
      const squareNumber = parseInt(firedAtSquare.dataset.index, 10); // Get the square number
      
      if (!firedShots.includes(squareNumber)) {
        firedShots.push(squareNumber);
      }
      
      if (leftSquareArray.includes(firedAtSquare)) {
        alert("Cannot fire at your own board");
        return;
      } else if (occupiedSquareArrayRight.includes(firedAtSquare)) {
        firedAtSquare.classList.remove("occupiedSquare");
        firedAtSquare.classList.add("hitSquare");
        console.log("Hit shot");
        ownHits += 1;
      } else {
        firedAtSquare.classList.add("missedSquare");
        console.log("Missed shot");
      }
      
      turn = 0;
      console.log(turn);
      console.log(firedAtSquare.id);
    }
  }


function removeButtonEventListener() {
    getElementById("resetButton").removeEventListener("click", resetShipPlacement);
    getElementById("randomizeButton").removeEventListener("click", () => randomizeShipPlacement("left"));
}


// Event listeners der kalder deres respektive funktioner
getElementById("resetButton")?.addEventListener("click", resetShipPlacement);
getElementById("randomizeButton")?.addEventListener("click", () => randomizeShipPlacement("left"));


// Waiting for player banner
const cancelButton = getElementById('cancelButton');
setBanner(true);


cancelButton.addEventListener('click', () => {
    setBanner(false);
    window.location.href = "/createGame";
});


