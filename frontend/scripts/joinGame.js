/** @module joinGame */

import { User } from "./state";
import { getElementById, getInputElement } from "./helperFunctions.js";

if (!User()) {
    window.location.href = "/login"; // 
}

const form = getElementById('joinGameForm');

form.addEventListener("submit", (e) => {
    e.preventDefault();
    findGame()
})

function findGame() {
    const battleNumber = getInputElement("battleNumber").value;

    if (battleNumber.length === 6) {
        window.location.replace(`/Game:${battleNumber}`);
    }
}