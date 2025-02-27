const gameBoardWrapper = document.querySelector("#gameBoardWrapper");

function createBoard() {
    const leftGameBoardWrapper = document.createElement("div");
    leftGameBoardWrapper.classList.add("gameBoard");

    const rightGameBoardWrapper = document.createElement("div");
    rightGameBoardWrapper.classList.add("gameBoard");

    gameBoardWrapper.append(leftGameBoardWrapper);
    gameBoardWrapper.append(rightGameBoardWrapper);
}

createBoard();

console.log(gameBoardWrapper);