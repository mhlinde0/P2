/** @module createGame */
import { getElementById, getInputElement } from "./helperFunctions.js";
import { User, setUser } from './state.js';

const apiBase = '/';


if (!User()) {
    window.location.href = "/login"; // go to front page
}

/**
 * 
 * @param {string} userId 
 * @param {string} gameCode 
 */
async function createGame(userId, gameCode) {
    try {
        const response = await fetch(apiBase + "game/create", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, lobbyCode: gameCode })
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Game ID:", data.gameId);
        getElementById("gameId").textContent = data.gameId;
        return data.gameId;
    } catch (error) {
        console.error("Error creating game:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const createGameButton = getElementById("createGameButton");
    const gameCodeInput = getInputElement("gameCodeInput");

    if (createGameButton) {
        createGameButton.addEventListener("click", () => {
            const userId = User()._id;
            const gameCode = gameCodeInput.value.trim();
            if (!gameCode) {
                alert("Please enter a game code.");
                return;
            }
            createGame(userId, gameCode);
        });
    }
});


export { createGame };
