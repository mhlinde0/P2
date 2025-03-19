/** @module joinGame */
import { User, setGameCode, setGameID } from "../utility/state.js";
import { getElementById, getInputElement } from "../utility/helperFunctions.js";

/*
if (!User()) {
    window.location.href = "/login";
}
    */

const form = getElementById('joinGameForm');
const apiBase = "/";



/**
 * Sends a POST request to join a game using the provided lobby code and user ID.
 * @param {string} userId - The user's ID.
 * @param {string} gameCode - The game code entered by the user.
 */
async function joinGame(userId, gameCode) {
  try {
    const response = await fetch(apiBase + "game/join", {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, gameCode })
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Joined game successfully:", data);

    // Save the gameId in session storage so the /game page can access it

    setGameID(data._id)
    setGameCode(data.gameCode);
    window.location.href = '/game';
    
    return data.gameId;
  } catch (error) {
    console.error("Error joining game:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const joinGameButton = getElementById("joinGameButton");
  const gameCodeInput = getInputElement("gameCode");

  if (joinGameButton) {
    joinGameButton.addEventListener("click", () => {
      console.log("Join game button clicked");
      const userId = User()._id;
      const gameCode = gameCodeInput.value.trim();
      console.log(gameCode);
      if (!gameCode) {
        alert("Please enter a lobby code.");
        return;
      }
      joinGame(userId, gameCode);
    });
  }
});
