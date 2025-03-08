
import { getGameState, setGameState, setGameId, getGameId, GameStates } from "./state.js";

document.addEventListener("DOMContentLoaded", ()=>{

    /* Create game, if not in game*/
    if (getGameState() == GameStates.NOT_IN_GAME) {
        createGame();
    }
    
    /* Set game ID on the UI if game is created*/
    if (getGameState() == GameStates.GAME_CREATED) {
        const gameId = document.getElementById("gameId");
        if (gameId) {
            gameId.innerHTML = "GAME ID: " + getGameId();
        }
    }
})

async function createGame() {
    try {
        const gameId = generateGameId()

        // funktionskald til backend om at generere game

        // hvis game er genereret i backend:
        setGameId(gameId);
        setGameState(GameStates.GAME_CREATED)
    } catch (err) {
        console.log(err)

    }
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


