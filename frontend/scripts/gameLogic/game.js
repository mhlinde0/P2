/** @module game */

import { User, Game, setGame } from '../utility/state.js';
import { setBanner, setLoading } from '../utility/ui.js';
import { getElementById, querySelectorAll } from '../utility/helperFunctions.js';
import { createShips, Ship } from './ships.js';
import { boardHeight, boardWidth } from './board.js';
import { deleteGame, fetchGameData, fireShot, submitShips } from './gameFunctions.js';


let fetchDataInterval = null

const turnElmnt = getElementById("turn")

initializeGame()


function setGameNames() {
    if (Game().status == 'active') {
        if (Game().players[0].name == User().name) {
            getElementById("enemyName").innerHTML = Game().players[1].name;
        } else {
            getElementById("enemyName").innerHTML = Game().players[0].name;
        }
    }
}


function startOrStopGameFetchIfNeeded() {
    if (!fetchDataInterval) {
        fetchDataInterval = setInterval(() => {
            handleFetchGameData();
            checkGameState();
   
        }, 2000)
    } 

}


function checkGameState() {
    if (!Game()) {
        window.location.href = "/"
    }
    if (Game().status === "waiting") {
        setBanner(true)
    }
    if (Game().status === "active") {
        setGameNames();

        if (Game().currentTurn == User()._id) {
            turnElmnt.innerHTML = "Your turn" 
            clearInterval(fetchDataInterval);
            fetchDataInterval = null;
        } else {
            turnElmnt.innerHTML = "Enemy turn"
        }
        setBanner(false)
    }
}

async function handleFetchGameData() {

    const gameData = await fetchGameData(Game()._id);
    
    if (gameData) {
        setGame(gameData)
    }

}



/** Fetches game data, and initalizes the fields;
 * @function
 */
async function initializeGame() {
    console.log("Initializing game...")
    setLoading(true)


    handleFetchGameData()

    if (Game()) {
        getElementById("gameCode").innerHTML = `Game Code: ${Game().gameCode}`;
        setGameNames();
        initializeFields();
        checkGameState();
        startOrStopGameFetchIfNeeded();
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



let currentHoveredShip = null;

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

                // Adds hover effect when dragging ship
                field.addEventListener("drop", (e) => {
                    console.log("onShipDrop triggered");
                    onShipDrop(e);
                });
            }
            if (side == "right") field.addEventListener("click", handleFireShot); 
            
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

    const shipId = e.dataTransfer.getData("text/plain"); // text/plain fortæller at dataen vi leder efter er ren tekst

    const shipElmnt = getElementById(shipId); // htmlElement

    const draggedShip = getShipObjectByID(shipElmnt.id); // ship object

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

    if (checkForOverlap(coveredFields)) {
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

/** checks if there already are any ships on the fields
 * @function
 * @param {any} coveredFields
 */
function checkForOverlap(coveredFields) {


    for (let i = 0; i < coveredFields.length; i++) {
        const fieldElement = getElementById("leftfield" + (coveredFields[i]));
        if (occupiedFieldArrayLeft.includes(fieldElement)) {
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

            if (checkForOverlap(coveredFields)) {
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

}



async function handleSubmitShips(e) {
    e.preventDefault();
    setLoading(true)

    const updatedGame = await submitShips(Game()._id, User()._id, shipsClass)

    if (updatedGame) {
        setGame(updatedGame);
    }

    setLoading(false)

}
getElementById("readyButton").addEventListener("click", handleSubmitShips);


async function handleFireShot(e) {
    e.preventDefault();

    if (Game().currentTurn !== User()._id) {
        return;
    }

    if (!Game().players[0].ready || !Game().players[1].ready) {
        window.alert("Waiting for ships to be placed")
    }

    const firedAtField = e.currentTarget;
    const field = parseInt(firedAtField.dataset.index, 10); // Get the field number


    const updatedGame = await fireShot(Game()._id, field)


    // UPDATE UI FOR SHOT
    if (checkIfHit(field)) {
        firedAtField.classList.remove("occupiedField");
        firedAtField.classList.add("hitField");
        console.log("Hit shot");
    } else {
        firedAtField.classList.add("missedField");
        console.log("Missed shot");
    }

    setGame(updatedGame);
    checkGameState();
    startOrStopGameFetchIfNeeded();

    // UDSKIFT FIELD MED EN KOPI AF SIG SELV, SÅ MAN IKKE KAN SKYDE TO GANGE
    firedAtField.parentNode.replaceChild(firedAtField.cloneNode(true), firedAtField)

}


/**
 * 
 * @param {number} field 
 * @returns {boolean}
 */
function checkIfHit(field) {

    console.log("fieldNumber", field)
    let checkPlayer = 0;
    
    if (Game().players[0].userId == User()._id) {
        checkPlayer = 1
    }


    for (let i = 0; i < 5; i++) {
        if (Game().players[checkPlayer].ships[i].location.coveredFields.includes(field)) {
            return true;
        }
    }
    return false
}



async function handleDeleteGame(e) {
    setLoading(true);
    e.preventDefault();
    const response = await deleteGame(Game()._id)
    if (response) {
        setGame(null);
        window.location.href = "/";
    }

    setLoading(false);
}


// Event listeners der kalder deres respektive funktioner
getElementById("exitGameButton").addEventListener("click", handleDeleteGame)
getElementById("resetButton")?.addEventListener("click", resetShipPlacement);
getElementById("randomizeButton")?.addEventListener("click", () => randomizeShipPlacement("left"));
getElementById('cancelButton').addEventListener('click', handleDeleteGame)


