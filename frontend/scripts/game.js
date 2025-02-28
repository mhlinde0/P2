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
    createSquares(leftGameBoardWrapper);

    const rightGameBoardWrapper = document.createElement("div");
    rightGameBoardWrapper.classList.add("gameBoard");

    gameBoardWrapper.append(rightGameBoardWrapper);
    createSquares(rightGameBoardWrapper);

}

// Gets array of ship divs
const shipsDiv = document.querySelectorAll(".ship");

// Creates 100 squares to fill the game boards and adds drag and drop functionalty to them
function createSquares(gameboard) {
    for (let i = 0; i < width * height; i++) {
        const square = document.createElement("div");
        square.classList.add("square");
        square.id = "square" + i;

        square.addEventListener("dragover", (event) => {
            event.preventDefault();
        })

        square.addEventListener("drop", (event) => {
            event.preventDefault();

            const shipId = event.dataTransfer.getData("text/plain");
            const draggedShipElement = document.getElementById(shipId);
            let draggedShip = null;

            if (draggedShipElement.id === "destroyerSize2") {
                draggedShip = destroyer;
            } else if (draggedShipElement.id === "submarineSize3") {
                draggedShip = submarine;
            } else if (draggedShipElement.id === "cruiserSize3") {
                draggedShip = cruiser;
            } else if (draggedShipElement.id === "battleshipSize4") {
                draggedShip = battleship
            } else if (draggedShipElement.id === "carrierSize5") {
                draggedShip = carrier;
            }

            const droppedSquare = parseInt(square.id.replace("square", ""), 10);

            const draggedShipLength = draggedShip.length;
            const draggedShipRotation = parseInt(draggedShipElement.getAttribute("data-rotation") || "0", 10);

            let coveredSquares = [];
            if (draggedShipRotation % 180 === 0) {
                for (let j = 0; j < draggedShipLength; j++) {
                    coveredSquares.push(droppedSquare + j * width);
                }
            } else {
                for (j = 0; j < draggedShipLength; j++) {
                    coveredSquares.push(droppedSquare + j);
                }
            }

            const occupiedSquareArray = [];
            coveredSquares.forEach(index => {
                const occupiedSquare = document.getElementById("square" + index);
                if (occupiedSquare) {
                    occupiedSquare.classList.add("occupiedSquare");
                    occupiedSquareArray.push(occupiedSquare)
                }
            })

            console.log(draggedShip, draggedShipLength);
            console.log("Ship placed covering squares:", coveredSquares);
            console.log(occupiedSquareArray);

        })

        gameboard.append(square);
    }
}


shipsDiv.forEach(ship => {
    ship.addEventListener("dragstart", (event) => {
        event.dataTransfer.setData("text/plain", ship.id);
    })
})

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


createBoards();