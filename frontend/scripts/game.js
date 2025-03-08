const gameBoardWrapper = document.getElementById("gameBoardWrapper");
// board size in squares
const boardWidth = 10;
const boardHeight = 10;
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

// Array of ship divs
const shipsDiv = document.querySelectorAll(".ship");
// Array of squares that are filled by ships
const occupiedSquareArrayLeft = [];
const occupiedSquareArrayRight = [];

const leftSquareArray = [];
const rightSquareArray = [];

let currentHoveredShip = null;

// Creates 2 game boards
function createBoards() {
    const leftGameBoardWrapper = document.createElement("div");
    leftGameBoardWrapper.classList.add("gameBoard");
    
    gameBoardWrapper?.append(leftGameBoardWrapper);
    createSquares(leftGameBoardWrapper, "left");

    const rightGameBoardWrapper = document.createElement("div");
    rightGameBoardWrapper.classList.add("gameBoard");

    gameBoardWrapper?.append(rightGameBoardWrapper);
    createSquares(rightGameBoardWrapper, "right");

}


// Creates 100 squares to fill the game boards and adds drag and drop functionalty to them
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
        square.dataset.index = i + 1;

        // Tilføjer nødvendige event listeners til alle squares når de bliver lavet
        square.addEventListener("dragover", (event) => { 
            event.preventDefault();
        })

        square.addEventListener("drop", onShipDrop);

        square.addEventListener("click", fireCannon); 

        // Tilføjer square div til gameboard div
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


    draggedShipElement.style.display = "none"; // Gør html elementet usynligt når skibet bliver placeret

    assignOccupiedSquares(coveredSquares, side);

    console.log(occupiedSquareArrayLeft)
}

// Tjekker om skibet er ude for spillebrættet
function checkForOutOfBounds(startRow, startColumn, shipLength, rotation) {
    if (rotation % 180 === 0) { // Hvis lodret
        return (startRow + shipLength > boardHeight);
    } else { // Hvis vandret
        return (startColumn + shipLength > boardWidth);
    }
}

// Tjekker hvilken side spilleren forsøger at placere skibet
function checkForBoardSide(side) {
    if (side === "right") {
        return true;
    }
    return false;
}

// Tjekker om der allerede befinder sig et skib på de ønskede felter
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
        let cloneImageShip = ship.cloneNode(true);

        // Sætter skibet rotation (transform) til klonens
        const style = getComputedStyle(ship);
        cloneImageShip.style.transform = style.transform

        // Placerer klonen så den ikke er synlig
        cloneImageShip.style.position = "absolute";
        cloneImageShip.style.top = "-2000px";
        cloneImageShip.style.left = "-2000px";

        document.body.appendChild(cloneImageShip);

        // Sætter klonen til at være drag image
        event.dataTransfer.setDragImage(cloneImageShip, 0, 0);
        event.dataTransfer.setData("text/plain", ship.id);

        // Fjerne klonen efter event queuen (timeren er sat til 0 millisekunder)
        setTimeout(() => {
            document.body.removeChild(cloneImageShip);
        }, 0);
    })
})


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

function resetShipPlacement() {
    // Finder alle left elementer og fjerner occupiedSquare classen hvis de har den
    const squares = document.querySelectorAll(".left");
    squares.forEach(square => square.classList.remove("occupiedSquare"));

    occupiedSquareArrayLeft.length = 0;

    // Finder elementer med class "ship" og gør dem synlige igen og fjerne rotation)
    const ships = document.getElementsByClassName("ship");
    for (let i = 0; i < ships.length; i++) {
        ships[i].style.display = "block";
        ships[i].style.transform = "rotate(0deg)";
        ships[i].setAttribute("data-rotation", "0");
    }
}

function randomizeShipPlacement(boardSide) {
    resetShipPlacement();

    // Går over arrayet af ship classes for at placere alle skibene
    shipsClass.forEach (ship => {
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

            if (boardSide === "left") {
            // Finder skibets id og gemmer elementet når placeret
            const shipElement = document.getElementById(ship.name + "Size" + ship.length);
            shipElement.style.display = "none";
            }
            
            placed = true;
        }
    })
    console.log(boardSide === "left" ? occupiedSquareArrayLeft : occupiedSquareArrayRight);
}


function fireCannon(event) {
    
    const firedAtSquare = event.currentTarget
    if (leftSquareArray.includes(firedAtSquare)) {
        alert("Cannot fire at your own board");
        return;
    } else if (occupiedSquareArrayRight.includes(firedAtSquare)) {
        firedAtSquare.classList.remove("occupiedSquare");
        firedAtSquare.classList.add("hitSquare");

        console.log("Hit shot");
    } else {
        firedAtSquare.classList.add("missedSquare");

        console.log("Missed shot");
    }
    console.log(firedAtSquare.id);
}

function createTargetList() {
    let targetList = [];
    for (let i = 1; i <= 100; i++) {
        targetList.push(i);
    }
    console.log(targetList);
    return targetList
}

function botFireCannon() {
    
    const firedAtSquare = document.getElementById(`leftsquare${getNextRandomTarget()}`);
    
    if (rightSquareArray.includes(firedAtSquare)) {
        alert("bot should not fire at its own board");
        return;
    } else if (occupiedSquareArrayLeft.includes(firedAtSquare)) {
        firedAtSquare.classList.remove("occupiedSquare");
        firedAtSquare.classList.add("hitSquare");

        console.log("Hit shot");
    } else {
        firedAtSquare?.classList.add("missedSquare");

        console.log("Missed shot");
    }
    console.log("Bot fired at:",firedAtSquare?.id);
}

function getNextRandomTarget() {  
    const randomIndex = Math.floor(Math.random() * targetList.length);
    const randomTarget = targetList[randomIndex];
    targetList.splice(randomIndex, 1);
    
    return randomTarget;
  }
  

// Event listeners der kalder deres respektive funktioner
document.getElementById("resetButton")?.addEventListener("click", resetShipPlacement);
document.getElementById("randomizeButton")?.addEventListener("click", () => randomizeShipPlacement("left"));

createBoards();
let targetList = createTargetList() //creates bots target list botFirecannon will not work without this
botFireCannon()
botFireCannon()
botFireCannon()
botFireCannon()
botFireCannon()

randomizeShipPlacement("right");