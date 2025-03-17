/** @module createGame */
/*
import { User  } from "./state.js";

if (!User()) {
    window.location.href = "/login"; // go to front page
}
*/
document.addEventListener("DOMContentLoaded", () => {

})

async function createGame() {
    try {
        const battleNumber = generateBattleNumber();

        // funktionskald til backend om at generere game
        

        // hvis game er genereret i backend:

    } catch (err) {
        console.log(err)

    }
}

// Generates random 6 character ID
function generateBattleNumber() {
    let battleNumber = ""

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


