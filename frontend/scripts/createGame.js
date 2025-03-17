/** @module createGame */

import { getElementById } from "./helperFunctions.js";

/*
import { User  } from "./state.js";

if (!User()) {
    window.location.href = "/login"; // go to front page
}
*/

const apiBase = '/';


async function createGame(userId, gameCode) {
    try {
      const response = await fetch(apiBase + "game/createGame", {  
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

// Generates random 6 character ID
function generateBattleNumber() {

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
