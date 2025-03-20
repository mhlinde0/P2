/** @module game */

import { User, gameCode, setGameCode, gameID, setGameID } from '../utility/state.js';
import { setBanner, setLoading } from '../utility/ui.js';
import { getElementById, querySelectorAll } from '../utility/helperFunctions.js';
import { createShips } from './ships.js';
import { boardHeight, boardWidth } from './board.js';

const apiBase = '/';


// holds the game object 
let Game = null


initializeGame()


/** Fetches game data, and initalizes the fields;
 * @function
 */
async function initializeGame() {
    console.log("Initializing game...")
    setLoading(true)

    await fetchGameData();

    if (Game) {

        getElementById("gameCode").innerHTML = `Game Code: ${gameCode()}`;
        // Fetches gameData every x milliseconds and udates game object
        setInterval(() => {
            fetchGameData();
            if (!Game) {
                window.location.href = "/"
            }
            if (Game.status === "waiting") {
                setBanner(true)
            }
            if (Game.status === "active") {
                setBanner(false)
            }

        }, 1500)
        initializeFields();
    } else {
        window.location.href = "/"
    }
    setLoading(false)
}

// makes sure the user cant leave the game by pressing going back, without confirming
window.onbeforeunload = function () {
    return true;
};

/** Array of ship div elements
 * @type {Array<Object>} */
const shipsClass = createShips();

/** Array of ship div elements 
 * @type {Array<HTMLElement>} */
const shipsDiv = querySelectorAll(".ship");

/** Array of fields that are filled by ships 
 *  @type {Array<HTMLElement>}  */
const occupiedFieldArrayLeft = [];

/** Array of fields that are filled by ships 
 *  @type {Array<HTMLElement>}*/
const occupiedFieldArrayRight = [];

/** Array of fields that are filled by ships 
 *  @type {Array<HTMLElement>}  */
const leftFieldArray = [];

/** Array of fields that are filled by ships 
 *  @type {Array<HTMLElement>}  */
const rightFieldArray = [];

// Sets a timer that calls checkGameStatus every 1 seconds
//const checkGameStatusTimer = setInterval(checkGameStatus, 1000);

// Sets time that calls checkCurrentTurn
// const checkCurrentTurnTimer = setInterval(checkCurrentTurn, 1000);
let firedShots = [];

let currentHoveredShip = null;

let turn = 1;
let battleBegun = 0;
let enemyHits = 0;
let ownHits = 0;


/** Creates 100 fields to fill the game boards and adds drag and drop functionalty to them
 * @function
 */
export function initializeFields() {
    let gameboard = getElementById("leftGameBoard");
    let side = "left";

    for (let j = 0; j <= 1; j++) {
        if (j == 1) {
            gameboard = getElementById("rightGameBoard");
            side = "right";
        }

        for (let i = 0; i < boardWidth * boardHeight; i++) {
            const field = document.createElement("div");
            field.classList.add("field");
            field.classList.add(side);

            field.id = side + "field" + (i + 1);

            if (side === "left") {
                leftFieldArray.push(field);
            } else {
                rightFieldArray.push(field);
            }

            field.dataset.side = side;
            field.dataset.index = String(i + 1);

            // Adds hover effect when dragging ship to left squares

            if (side == "left") {
                field.addEventListener("dragover", (e) => {
                    e.preventDefault();
                    field.style.border = "2px solid black"
                })
                field.addEventListener("dragleave", (e) => {
                    e.preventDefault();
                    field.style.border = "1px solid black"
                })
            }
            // Adds hover effect when dragging ship
            if (side == "left") {
                field.addEventListener("drop", (e) => {
                    console.log("onShipDrop triggered");
                    onShipDrop(e);
                });
                field.addEventListener("click", (e) => {
                    console.log("fireCannon triggered");
                    fireCannon(e);
                });

            }
            // Tilføjer field div til gameboard div
            gameboard.append(field);

        }
    }
}

/** handles ship drop event
 * @function
 */
function onShipDrop(e) {
    e.preventDefault();

    const field = e.currentTarget;

    const side = field.dataset.side;
    if (checkForBoardSide(side)) {
        alert("Cannot place ships on opponent's board");
        return;
    }

    const shipId = e.dataTransfer.getData("text/plain"); // text/plain fortæller at dataen vi leder efter er ren tekst

    const shipElmnt = getElementById(shipId);

    const draggedShip = getShipObjectByID(shipElmnt.id);

    const droppedField = parseInt(field.dataset.index, 10);

    const draggedShipLength = draggedShip.length;

    const draggedShipRotation = parseInt(shipElmnt.getAttribute("data-rotation") || "0", 10); // Finder skibets nuværende rotation ved at finde attributen "data-rotation" og give den som en int

    const startColumn = (droppedField - 1) % boardWidth; // finder de næste felter ud fra start

    const startRow = Math.floor((droppedField - 1) / boardWidth);

    let coveredFields = [];



    if (draggedShipRotation % 180 === 0) { // Hvis % 180 === 0 er sandt betyder det at skibet er lodret 
        if (checkForOutOfBounds(startRow, startColumn, draggedShipLength, draggedShipRotation)) {
            alert("Ship is out of bounds.");
            return;
        }
        for (let j = 0; j < draggedShipLength; j++) { // Hvis skibet kan være der bliver felterne placeret i arrayet
            coveredFields.push(droppedField + j * boardWidth);
        }
    } else { // Hvis det ikke er sandt % 180 === 0 betyder det at skibet er vandret
        if (checkForOutOfBounds(startRow, startColumn, draggedShipLength, draggedShipRotation)) {
            alert("Ship is out of bounds.");
            return;
        }
        for (let j = 0; j < draggedShipLength; j++) {
            coveredFields.push(droppedField + j);
        }
    }

    if (checkForOverlap(coveredFields, side)) {
        alert("Ship overlaps another ship.");
        return;
    }

    draggedShip.rotation = String(draggedShipRotation);
    draggedShip.location = {
        startField: droppedField,
        coveredFields: coveredFields
    };

    shipElmnt.style.display = "none"; // Gør html elementet usynligt når skibet bliver placeret

    assignOccupiedFields(coveredFields, side);
    if (occupiedFieldArrayLeft.length === 17) {
        battleBegun = 1;
        removeButtonEventListener();
    }
    console.log(occupiedFieldArrayLeft)
}

function getShipObjectByID(ID) {
    let draggedShip = null;
    // finder hvilken class ship vi skal bruge ud fra html elementet
    if (ID === "destroyerSize2") {
        draggedShip = shipsClass[0] // destoryer
    } else if (ID === "submarineSize3") {
        draggedShip = shipsClass[1]; // submarine
    } else if (ID === "cruiserSize3") {
        draggedShip = shipsClass[2]; // cruiser
    } else if (ID === "battleshipSize4") {
        draggedShip = shipsClass[3]; // battleship
    } else if (ID === "carrierSize5") {
        draggedShip = shipsClass[4]; // carrier
    }
    if (!draggedShip) {
        throw new Error("Couldn't handle ship draggin properly");
    }
    return draggedShip
}

/**
 * 
 * @param {Ship} ship 
 * @returns 
 */

/*
function findPlacementFields(ship) {
    console.log("dragged ship:", ship)
    let fieldIDs = [ship.location];
    console.log(ship.location);
    if (ship.rotation == "vertical") {

        for (let i = 1; i <= ship.length; i++) {
            if ((ship.location + i) % 10 === 1) {
                alert("ship is is is out of bounds");
                return [];
            } else {
                fieldIDs.push(ship.location + i + 10)
            }
        }
    }

    if (ship.rotation == "horizontal") {
        for (let i = 1; i <= ship.length; i++) {
            if ((ship.location + i) % 10 === 1) {
                alert("ship is is is out of bounds");
                return [];
            } else {
                fieldIDs.push(ship.location + i)
            }
        }
    }
    console.log("fields:",fieldIDs)
    return fieldIDs;
}
*/
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

/** checks if there already are any ships on the fields
 * @function
 * @param {any} coveredFields
 * @param {"left"|"right"} side - side is either "left" or right
 */
function checkForOverlap(coveredFields, side) {
    const occupiedArray = side === "left" ? occupiedFieldArrayLeft : occupiedFieldArrayRight;

    for (let i = 0; i < coveredFields.length; i++) {
        const fieldElement = getElementById(side + "field" + (coveredFields[i]));
        if (occupiedArray.includes(fieldElement)) {
            return true;
        }
    }
    return false;
}

/** Tilføjer elementet occupiedField til de fields med skibe på
 * @function
 */
function assignOccupiedFields(coveredFields, side) {
    coveredFields.forEach(index => {
        const fieldElement = getElementById(side + "field" + (index));
        if (fieldElement) {
            fieldElement.classList.add("occupiedField");
            if (side === "left") {
                occupiedFieldArrayLeft.push(fieldElement);
            } else if (side === "right") {
                occupiedFieldArrayRight.push(fieldElement);
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
    // Finder alle left elementer og fjerner occupiedField classen hvis de har den
    const fields = querySelectorAll(".left");

    fields.forEach((field) => field.classList.remove("occupiedField"));

    occupiedFieldArrayLeft.length = 0;

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

            let droppedField = row * boardWidth + col + 1;
            let coveredFields = [];

            if (rotation % 180 === 0) {
                for (let j = 0; j < ship.length; j++) { // Lodret placering
                    coveredFields.push(droppedField + j * boardWidth);
                }
            } else {
                for (let j = 0; j < ship.length; j++) { // Vandret placering
                    coveredFields.push(droppedField + j);
                }
            }

            if (checkForOverlap(coveredFields, boardSide)) {
                continue;
            }

            assignOccupiedFields(coveredFields, boardSide);

            ship.rotation = String(rotation);
            ship.location = {
                startField: droppedField,
                coveredFields: coveredFields
            };

            if (boardSide === "left") {
                // Finder skibets id og gemmer elementet når placeret
                const shipElement = getElementById(ship.name + "Size" + ship.length);
                shipElement.style.display = "none";
            }

            placed = true;
        }
    })
    console.log(boardSide === "left" ? occupiedFieldArrayLeft : occupiedFieldArrayRight);
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
    const id = gameID();
    if (!id) {
        console.error("Game ID not found in session storage");
        return;
    }

    try {
        const response = await fetch(`/game`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, userId, ships, shots, ready })
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
async function fetchGameData() {

    if (!gameID()) return;

    try {
        // Fetch from the dedicated endpoint
        const response = await fetch(`/game/data?gameId=${gameID()}`);
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`)
        }

        const gameData = await response.json();
        Game = gameData;
        console.log("game:", Game)

        if (!Game) {
            console.log("game")
            // window.location.href = "/"
            throw new Error("could not get game data");
        }

    } catch (error) {
        console.error("Error fetching gameData:", error);

    }
}

/*
// Checks for game status
async function checkGameStatus() {

    if (!gameID()) return;

    try {
        // Fetch from the dedicated endpoint
        const response = await fetch(`/game/data?gameId=${gameID()}`);
        if (!response.ok) throw new Error(`Server error: ${response.status}`);

        const gameData = await response.json();

        if (gameData.status === 'active') {
            setBanner(true);
            clearInterval(checkGameStatusTimer); // Removes the timer if game status is active
        }
    } catch (error) {
        console.error("Error checking game state:", error);
    }
}


async function checkCurrentTurn() {
    const userId = User()._id;

    if (!gameID()) return;

    try {
        const response = await fetch(`/game/data?gameId=${gameID()}`);
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
*/

function fireCannon(e) {
    if (battleBegun === 1) {
        const firedAtField = e.currentTarget;
        const fieldNumber = parseInt(firedAtField.dataset.index, 10); // Get the field number

        if (!firedShots.includes(fieldNumber)) {
            firedShots.push(fieldNumber);
        }

        if (leftFieldArray.includes(firedAtField)) {
            alert("Cannot fire at your own board");
            return;
        } else if (occupiedFieldArrayRight.includes(firedAtField)) {
            firedAtField.classList.remove("occupiedField");
            firedAtField.classList.add("hitField");
            console.log("Hit shot");
            ownHits += 1;
        } else {
            firedAtField.classList.add("missedField");
            console.log("Missed shot");
        }

        turn = 0;
        console.log(turn);
        console.log(firedAtField.id);
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
cancelButton.addEventListener('click', () => {
    deleteGame();

});


async function deleteGame() {

    if (!gameID()) return;

    try {
        // Fetch from the dedicated endpoint
        const response = await fetch(`/game/delete/${gameID()}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error(`Server error: ${response.status}`);

        const gameData = await response.json();

        setGameID(null)
        setGameCode(null)
        window.location.href = "/";

    } catch (error) {
        console.error("Error checking game state:", error);
    }
}


