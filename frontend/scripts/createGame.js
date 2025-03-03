
import { getGameState, setGameState, setGameId, getGameId, GameStates } from "./state.js";


if (getGameState() == GameStates.NOT_IN_GAME) {
    setGameId(generateGameId());
    setGameState(GameStates.GAME_CREATED)
}

const gameId = document.getElementById("gameId");
if (gameId) {
    gameId.innerHTML = "GAME ID: " + getGameId();
}

// Generates random 6 character ID
function generateGameId() {
    let gameId = ""

    for (let i = 0; i < 6; i++) {
        if (Math.random() < 0.5) {
            const randomLetterCode = Math.floor(Math.random() * 25) + 65;
            gameId += String.fromCharCode(randomLetterCode)
        } else {
            gameId += String(Math.floor(Math.random() * 9))
        }
    }
    return gameId;
}

export { generateGameId }


