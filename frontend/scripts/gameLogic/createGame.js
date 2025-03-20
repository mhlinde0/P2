/** @module createGame */

import { getElementById, getInputElement } from "../utility/helperFunctions.js";
import { User, setGame } from '../utility/state.js';
import { setLoading } from "../utility/ui.js";

const apiBase = '/';


if (!User()) {
    window.location.href = "/login"; // go to front page
}

const form = getElementById("createGameForm");


form.addEventListener("submit", (e) => {
  e.preventDefault();
  const gameCodeInput = getInputElement("gameCodeInput");
  const gameCode = gameCodeInput.value.trim();
  createGame(User()._id, gameCode);
});

/**
 * 
 * @param {string} userId 
 * @param {string} gameCode 
 */

async function createGame(userId, gameCode) {
  setLoading(true);
  try {
    const response = await fetch(apiBase + "game/create", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, gameCode })
    });

    if (!response.ok) {
      window.alert(response.statusText)
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Game created:", data);

    // Store the _id from the MongoDB document
    setGame(data);
    window.location.href = '/game';

  } catch (error) {
    console.error("Error creating game:", error);
  }
  setLoading(false);
}




