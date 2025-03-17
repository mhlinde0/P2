/** @module joinGame */

import { User } from "./state";
import { getElementById, getInputElement } from "./helperFunctions.js";

if (!User()) {
    window.location.href = "/login"; // 
}

const form = getElementById('joinGameForm');
const apiBase = "/api/";



/**
 * Sends a POST request to join a game using the provided lobby code and user ID.
 * @param {string} userId - The user's ID.
 * @param {string} gameCode - The game code entered by the user.
 */

async function joinGameRequest(userId, gameCode) {
    try {
      const response = await fetch(apiBase + "game/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        bbody: JSON.stringify({ userId, lobbyCode: gameCode })
      });
  
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Joined game successfully:", data);

      // Save the gameId in session storage
      sessionStorage.setItem('gameId', data.gameId);
      window.location.href = '/game';
  
      return data;
    } catch (error) {
      console.error("Error joining game:", error);
    }
  }

  window.joinGame = async function joinGame(event) {
    event.preventDefault(); // Prevent the form from reloading the page
  
    const userId = User()._id; // Retrieve current user's ID
    const lobbyCodeInput = getElementById("gameCode");
    const lobbyCode = lobbyCodeInput.value.trim();
  
    if (!lobbyCode) {
      alert("Please enter a lobby code.");
      return;
    }
  
    await joinGame(userId, lobbyCode);
  };