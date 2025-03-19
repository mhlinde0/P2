import { randomizeShipPlacement, resetShipPlacement, createBoards } from './game.js';

let targetList = createTargetList()
let enemyHits = 0;
let ownHits = 0;
let battleBegun = 0;
let turn = 1;

initializeBotGame(); // starts bot game



function createTargetList() {
    let targetList = [];
    for (let i = 1; i <= 100; i++) {
        targetList.push(i);
    }
    console.log(targetList);
    return targetList
}

function botFireCannon() {

    const firedAtSquare = getElementById(`leftsquare${getNextRandomTarget()}`);

    if (rightSquareArray.includes(firedAtSquare)) {
        alert("bot should not fire at its own board");
        return;
    }
    else if (occupiedSquareArrayLeft.includes(firedAtSquare)) {
        firedAtSquare.classList.remove("occupiedSquare");
        firedAtSquare.classList.add("hitSquare");
        console.log("Hit shot");
        enemyHits += 1;
    }
    else {
        firedAtSquare?.classList.add("missedSquare");
        console.log("Missed shot");
    }
    turn = 1;
    gameLoop();
    console.log("Bot fired at:", firedAtSquare?.id);
}

function getNextRandomTarget() {
    const randomIndex = Math.floor(Math.random() * targetList.length);
    const randomTarget = targetList[randomIndex];
    targetList.splice(randomIndex, 1);

    return randomTarget;
}

function checkWinCondition() {
    if (enemyHits === 17) {
        return 1;
    }
    else if (ownHits === 17) {
        return 2;
    }

}

if (turn == 0) {
    console.log("test")
    botFireCannon();
    turn = 1;
}

function gameLoop() {
    if (checkWinCondition() === 1) {
        alert("The bot won!");
    }
    else if (checkWinCondition() === 2) {
        alert("You have won!");
    }
    if (turn === 0) {
        console.log("Bot's Turn");
        botFireCannon();
    } else {
        console.log("Player's Turn");
    }
}

function initializeBotGame() {
    createBoards();
    randomizeShipPlacement("right");
    gameLoop();
}

function removeButtonEventListener() {
    getElementById("resetButton").removeEventListener("click", resetShipPlacement);
    getElementById("randomizeButton").removeEventListener("click", () => randomizeShipPlacement("left"));
}