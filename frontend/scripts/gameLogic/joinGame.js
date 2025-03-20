/** @module joinGame */
import { User, setGame, Game } from "../utility/state.js";
import { getElementById, getInputElement } from "../utility/helperFunctions.js";
import { setLoading } from "../utility/ui.js";


if (!User()) {
    window.location.href = "/login";
}
  
const apiBase = "/";

const form = getElementById('joinGameForm');
const joinGameButton = getElementById("joinGameButton");
const gameCodeInput = getInputElement("gameCode");



form.addEventListener("submit", (e) => {
  e.preventDefault();
  const gameCode = gameCodeInput.value.trim();

  joinGame(User()._id, gameCode);
});



/**
 * Sends a POST request to join a game using the provided lobby code and user ID.
 * @param {string} userId - The user's ID.
 * @param {string} gameCode - The game code entered by the user.
 */
async function joinGame(userId, gameCode) {
  setLoading(true);
  try {
    const response = await fetch(apiBase + "game/join", {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, gameCode })
    });

    if (!response.ok) {
      window.alert(response.statusText)
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Joined game successfully:", data);

    // Save the game so the /game page can access it
    setGame(data);
    window.location.href = '/game';

  } catch (error) {
    console.error("Error joining game:", error);
  }
  setLoading(false);
}





