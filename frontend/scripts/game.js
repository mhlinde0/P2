const gameBoardWrapper = document.getElementById("gameBoardWrapper");

// board pixels
const width = 10;
const height = 10;


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

function createSquares(gameboard) {
    for (let i = 0; i < width * height; i++) {
        const square = document.createElement("div");
        square.classList.add("square");
        square.id = "square" + i;
        gameboard.append(square);
    }
}

// gets array of ship elements
const ships = document.querySelectorAll(".ship");

let currentHoveredShip = null;

// Select a ship when hovered
ships.forEach((ship) => {
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