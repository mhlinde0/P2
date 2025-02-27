const gameBoardWrapper = document.querySelector("#gameBoardWrapper");

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

let currentHoveredShip = null;

const ships = document.querySelectorAll(".shipSelectionWrapper div");

ships.forEach(function(ship) {
    ship.addEventListener("mouseover", function(event) {
        currentHoveredShip = this;
        console.log("Hovered ship set:", currentHoveredShip);
    });

    ship.addEventListener("mouseout", function(event) {
        currentHoveredShip = null;
        console.log("Mouse left ship");
    })
});

document.addEventListener("keydown", function(event) {
    if (event.key.toLowerCase() === "r" && currentHoveredShip) {
        let currentRotation = parseInt(currentHoveredShip.getAttribute("data-rotation") || "0", 10);
        let newRotation = (currentRotation + 90) % 360;
        currentHoveredShip.style.transform = "rotate(" + newRotation + "deg)";
        currentHoveredShip.setAttribute("data-rotation", newRotation);
        console.log("Rotated ship to:", newRotation);
    }
});

createBoards();