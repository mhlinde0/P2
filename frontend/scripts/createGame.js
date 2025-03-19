/** @module createGame */

import { getElementById, getInputElement } from "./helperFunctions.js";
import { User, setUser } from './state.js';

const apiBase = '/';

/*
import { User  } from "./state.js";

if (!User()) {
    window.location.href = "/login"; // go to front page
}
*/


async function createGame(userId, gameCode) {
  try {
    const response = await fetch(apiBase + "game/create", {  
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, gameCode })
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Game created:", data);

    // Store the _id from the MongoDB document
    sessionStorage.setItem('gameId', data._id);
    window.location.href = '/game';

    return data._id;
  } catch (error) {
    console.error("Error creating game:", error);
  }
}
  
  document.addEventListener("DOMContentLoaded", () => {
    const createGameButton = getElementById("createGameButton");
    const gameCodeInput = getInputElement("gameCodeInput") ;

    if (createGameButton) {
      createGameButton.addEventListener("click", () => {
        console.log("Create game button clicked");
        const userId = User()._id;
        const gameCode = gameCodeInput.value.trim();
        console.log(gameCode);
        if (!gameCode) {
          alert("Please enter a game code.");
          return;
        }
        createGame(userId, gameCode);
      });
    }
  });
  
  export { createGame };
