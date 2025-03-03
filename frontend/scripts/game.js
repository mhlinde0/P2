//import './audioManager.js'

const gameBoardWrapper = document.getElementById("gameBoardWrapper");
// board size in squares
const width = 10;
const height = 10;
//Creates class for ships and places in array
class ship {
    constructor(name, length) {
        this.name = name;
        this.length = length;
    }
}
const destroyer = new ship("destroyer", 2);
const submarine = new ship("submarine", 3);
const cruiser = new ship("cruiser", 3);
const battleship = new ship("battleship", 4);
const carrier = new ship("carrier", 5);
const shipsClass = [destroyer, submarine, cruiser, battleship, carrier];

// Creates 2 game boards
function createBoards() {
    const leftGameBoardWrapper = document.createElement("div");
    leftGameBoardWrapper.classList.add("gameBoard");
    
    gameBoardWrapper.append(leftGameBoardWrapper);
    createSquares(leftGameBoardWrapper, "left");

    const rightGameBoardWrapper = document.createElement("div");
    rightGameBoardWrapper.classList.add("gameBoard");

    gameBoardWrapper.append(rightGameBoardWrapper);
    createSquares(rightGameBoardWrapper, "right");

}

// Array of ship divs
const shipsDiv = document.querySelectorAll(".ship");
// Array of squares that are filled by ships
const occupiedSquareArrayLeft = [];
const occupiedSquareArrayRight = [];

// Creates 100 squares to fill the game boards and adds drag and drop functionalty to them
function createSquares(gameboard, side) {
    for (let i = 0; i < width * height; i++) {
        const square = document.createElement("div");
        square.classList.add("square");
        square.classList.add(side);

        square.id = side + "square" + (i + 1);

        square.dataset.side = side;
        square.dataset.index = i + 1;

        square.addEventListener("dragover", (event) => {
            event.preventDefault();
        })

        square.addEventListener("drop", onShipDrop);

        gameboard.append(square);
    }
}

function onShipDrop(event) {
    event.preventDefault();

    const square = event.currentTarget;
    const side = square.dataset.side;
    const shipId = event.dataTransfer.getData("text/plain"); // text/plain fortæller at dataen vi leder efter er ren tekst
    const draggedShipElement = document.getElementById(shipId);
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

    const droppedSquare = parseInt(square.dataset.index, 10);
    const draggedShipLength = draggedShip.length;
    const draggedShipRotation = parseInt(draggedShipElement.getAttribute("data-rotation") || "0", 10); // Finder skibets nuværende rotation ved at finde attributen "data-rotation" og give den som en int

    const startColumn = (droppedSquare - 1) % width;
    const startRow = Math.floor((droppedSquare - 1) / width);

    let coveredSquares = [];

    if (draggedShipRotation % 180 === 0) { // Hvis % 180 === 0 er sandt betyder det at skibet er lodret 
        if (checkForOutOfBounds(startRow, startColumn, draggedShipLength, draggedShipRotation)) {
            alert("Ship is out of bounds.");
            return;
        }
        for (let j = 0; j < draggedShipLength; j++) { // Hvis skibet kan være der bliver felterne placeret i arrayet
            coveredSquares.push(droppedSquare + j * width);
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

    draggedShipElement.style.display = "none"; // Gør html elementet usynligt når skibet bliver placeret

    assignOccupiedSquares(coveredSquares, side);

    console.log(occupiedSquareArrayLeft)
}

function checkForOutOfBounds(startRow, startColumn, shipLength, rotation) {
    if (rotation % 180 === 0) { // Hvis lodret
        return (startRow + shipLength > height);
    } else { // Hvis vandret
        return (startColumn + shipLength > width);
    }
}

// Tjekker om der allerede befinder sig et skib på de ønskede squares
function checkForOverlap(coveredSquares, side) {
    const occupiedArray = side === "left" ? occupiedSquareArrayLeft : occupiedSquareArrayRight;
    
    for (let i = 0; i < coveredSquares.length; i++) {
        const squareElement = document.getElementById(side + "square" + (coveredSquares[i]));
        if (occupiedArray.includes(squareElement)) {
            return true;
        }
    }
    return false;
}

// Tilføjer elementet occupiedSquare til de squares med skibe på
function assignOccupiedSquares(coveredSquares, side) {
    coveredSquares.forEach(index => {
        const squareElement = document.getElementById(side + "square" + (index));
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
    ship.addEventListener("dragstart", (event) => {
        event.dataTransfer.setDragImage(ship, 0, 0);
        event.dataTransfer.setData("text/plain", ship.id);
    })
})

let currentHoveredShip = null;

// Select a ship when hovered
shipsDiv.forEach((ship) => {
    ship.addEventListener("mouseover", (event) => {
        currentHoveredShip = ship;
    });

    ship.addEventListener("mouseout", (event) => {
        currentHoveredShip = null;
    })
});

// Rotate ship when pressing r
document.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() === "r" && currentHoveredShip) {
        console.log(currentHoveredShip.getAttribute('id'))
        let currentRotation = parseInt(currentHoveredShip.getAttribute("data-rotation") || "0", 10);
        let newRotation = (currentRotation + 90) % 360;
        currentHoveredShip.style.transform = "rotate(" + newRotation + "deg)";
        currentHoveredShip.setAttribute("data-rotation", newRotation);
    }
});

createBoards();

function resetShipPlacement() {
    const squares = document.querySelectorAll(".square");
    squares.forEach(square => square.classList.remove("occupiedSquare"));

    occupiedSquareArrayLeft.length = 0;
    occupiedSquareArrayRight.length = 0;

    const ships = document.getElementsByClassName("ship");
    for (let i = 0; i < ships.length; i++) {
        ships[i].style.display = "block";
        ships[i].style.transform = "rotate(0deg)";
        ships[i].setAttribute("data-rotation", "0");
    }
}

document.getElementById("resetButton").addEventListener("click", resetShipPlacement);
