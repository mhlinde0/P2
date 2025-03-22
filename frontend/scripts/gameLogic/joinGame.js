/** @module joinGame */
import { User, setGame, Game } from "../utility/state.js";
import { getElementById, getInputElement } from "../utility/helperFunctions.js";
import { setLoading } from "../utility/ui.js";
import { joinGame } from "./gameFunctions.js";


if (!User()) {
    window.location.href = "/login";
}
  

const form = getElementById('joinGameForm');
const joinGameButton = getElementById("joinGameButton");
const gameCodeInput = getInputElement("gameCode");



form.addEventListener("submit", handleJoinGame);


async function handleJoinGame(e) {  
  e.preventDefault()
  setLoading(true)
  const gameCode = gameCodeInput.value.trim();

  const gameData = await joinGame(User()._id,gameCode, User().name);

  if (gameData) {
        // Save the game so the /game page can access it
        setGame(gameData);
        window.location.href = '/placeShips'; 
  }

  setLoading(false)
}






