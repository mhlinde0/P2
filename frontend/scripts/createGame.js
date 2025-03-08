
import { User, getGameState, setGameState, setBattleNumber, getBattleNumber, GameStates } from "./state.js";

if (!User()) {
    window.location.href = "/login"; // go to front page
}

document.addEventListener("DOMContentLoaded", () => {
    /* Create game, if not in game*/
    if (getGameState() == GameStates.NOT_IN_GAME) {
        createGame();
    }

    /* Set Battle Number on the UI if game is created*/
    if (getGameState() == GameStates.GAME_CREATED) {
        const battleNumber = document.getElementById("battleNumber");
        if (battleNumber) {
            battleNumber.innerHTML = "Battle Number: " + getBattleNumber();
        }
    }
})

async function createGame() {
    try {
        const battleNumber = generateBattleNumber();

        // funktionskald til backend om at generere game

        // hvis game er genereret i backend:
        setBattleNumber(battleNumber);
        setGameState(GameStates.GAME_CREATED)
    } catch (err) {
        console.log(err)

    }
}

// Generates random 6 character ID
function generateBattleNumber() {
    let battleNumber = ""

    for (let i = 0; i < 6; i++) {
        if (Math.random() < 0.5) {
            const randomLetterCode = Math.floor(Math.random() * 25) + 65;
            battleNumber += String.fromCharCode(randomLetterCode)
        } else {
            battleNumber += String(Math.floor(Math.random() * 9))
        }
    }
    return battleNumber;
}


export { generateBattleNumber }


