const gameBoardWrapper = document.getElementById("gameBoardWrapper");

// board size in squares
const width = 10;
const height = 10;

// Creates 2 game boards
function createBoards() {
    const leftGameBoardWrapper = document.createElement("div");
    leftGameBoardWrapper.classList.add("gameBoard");
    
    gameBoardWrapper.append(leftGameBoardWrapper);
    createSquares(leftGameBoardWrapper);

    const rightGameBoardWrapper = document.createElement("div");
    rightGameBoardWrapper.classList.add("gameBoard");

    gameBoardWrapper.append(rightGameBoardWrapper);
    createSquares(rightGameBoardWrapper);

}

// Creates 100 squares to fill the game boards
function createSquares(gameboard) {
    for (let i = 0; i < width * height; i++) {
        const square = document.createElement("div");
        square.classList.add("square");
        square.id = "square" + i;
        gameboard.append(square);
    }
}

// Gets array of ship divs
const shipsDiv = document.querySelectorAll(".ship");

let currentHoveredShip = null;

// Select a ship when hovered
shipsDiv.forEach((ship) => {
    ship.addEventListener("mouseover", (event) => {
        currentHoveredShip = ship;
        console.log("Hovered ship set:", currentHoveredShip);
    });

    ship.addEventListener("mouseout", (event) => {
        currentHoveredShip = null;
        console.log("Mouse left ship");
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
        console.log("Rotated ship to:", newRotation);
    }
});

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
const battleship = new ship("battleship", 2);
const carrier = new ship("carrier", 2);

const shipsClass = [destroyer, submarine, cruiser, battleship, carrier];

console.log(shipsClass);

createBoards();