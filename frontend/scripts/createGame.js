/** @module createGame */

import { getElementById } from "./helperFunctions.js";
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
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId }) 
      });
  
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Game ID:", data.gameId);
  
      document.getElementById("gameId").textContent = data.gameId;
  
      return data.gameId;
    } catch (error) {
      console.error("Error creating game:", error);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const createGameButton = document.getElementById("createGameButton");
    if (createGameButton) {
      createGameButton.addEventListener("click", () => {
        const userId = User()._id;
        const gameCode = test123;
        createGame(userId, gameCode);
      });
    }
  });


export { generateBattleNumber }
