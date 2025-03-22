/** @module game */

import { User, Game, setGame } from '../utility/state.js';
import { setBanner, setLoading } from '../utility/ui.js';
import { getElementById, querySelectorAll } from '../utility/helperFunctions.js';
import { createShips, Ship } from './ships.js';
import { boardHeight, boardWidth } from './board.js';
import { deleteGame, fetchGameData, fireShot, submitShips } from './gameFunctions.js';


let fetchDataInterval = null

const turnElmnt = getElementById("turn")

initializeGame()


function setGameNames() {
    if (Game().status == 'active') {
        if (Game().players[0].name == User().name) {
            getElementById("enemyName").innerHTML = Game().players[1].name;
        } else {
            getElementById("enemyName").innerHTML = Game().players[0].name;
        }
    }
}


function startOrStopGameFetchIfNeeded() {
    if (!fetchDataInterval) {
        fetchDataInterval = setInterval(() => {
            handleFetchGameData();
            checkGameState();
   
        }, 2000)
    } 

}


function checkGameState() {
    if (!Game()) {
        window.location.href = "/"
    }
    if (Game().status === "waiting") {
        setBanner(true)
    }
    if (Game().status === "active") {
        setGameNames();

        if (Game().currentTurn == User()._id) {
            turnElmnt.innerHTML = "Your turn" 
            clearInterval(fetchDataInterval);
            fetchDataInterval = null;
        } else {
            turnElmnt.innerHTML = "Enemy turn"
        }
        setBanner(false)
    }
}

async function handleFetchGameData() {

    const gameData = await fetchGameData(Game()._id);
    
    if (gameData) {
        setGame(gameData)
    }

}



/** Fetches game data, and initalizes the fields;
 * @function
 */
async function initializeGame() {
    console.log("Initializing game...")
    setLoading(true)


    handleFetchGameData()

    if (Game()) {
        setGameNames();
        initializeFields();
        checkGameState();
        startOrStopGameFetchIfNeeded();
    } else {
        window.location.href = "/"
    }
    setLoading(false)
}


// makes sure the user cant leave the game by pressing going back, without confirming
window.onbeforeunload = function () {
    return true;
};



/** Creates 100 fields to fill the game boards and adds drag and drop functionalty to them
 * @function
 */
export function initializeFields() {
    let gameboard = getElementById("leftGameBoard");
    let side = "left";

    for (let j = 0; j <= 1; j++) {
        if (j == 1) {
            gameboard = getElementById("rightGameBoard");
            side = "right";
        }

        for (let i = 0; i < boardWidth * boardHeight; i++) {
            const field = document.createElement("div");
            field.classList.add("field");
            field.classList.add(side);

            field.id = side + "field" + (i + 1);



            field.dataset.side = side;
            field.dataset.index = String(i + 1);

            // Adds hover effect when dragging ship to left squares

            if (side == "left") {
                field.addEventListener("dragover", (e) => {
                    e.preventDefault();
                    field.style.border = "2px solid black"
                })
                field.addEventListener("dragleave", (e) => {
                    e.preventDefault();
                    field.style.border = "1px solid black"
                })


            }
            if (side == "right") field.addEventListener("click", handleFireShot); 
            
            // Tilføjer field div til gameboard div
            gameboard.append(field);
        }
    }
}










async function handleFireShot(e) {
    e.preventDefault();

    if (Game().currentTurn !== User()._id) {
        return;
    }

    if (!Game().players[0].ready || !Game().players[1].ready) {
        window.alert("Waiting for ships to be placed")
    }

    const firedAtField = e.currentTarget;
    const field = parseInt(firedAtField.dataset.index, 10); // Get the field number


    const updatedGame = await fireShot(Game()._id, field)


    // UPDATE UI FOR SHOT
    if (checkIfHit(field)) {
        firedAtField.classList.remove("occupiedField");
        firedAtField.classList.add("hitField");
        console.log("Hit shot");
    } else {
        firedAtField.classList.add("missedField");
        console.log("Missed shot");
    }

    setGame(updatedGame);
    checkGameState();
    startOrStopGameFetchIfNeeded();

    // UDSKIFT FIELD MED EN KOPI AF SIG SELV, SÅ MAN IKKE KAN SKYDE TO GANGE
    firedAtField.parentNode.replaceChild(firedAtField.cloneNode(true), firedAtField)

}


/**
 * 
 * @param {number} field 
 * @returns {boolean}
 */
function checkIfHit(field) {

    console.log("fieldNumber", field)
    let checkPlayer = 0;
    
    if (Game().players[0].userId == User()._id) {
        checkPlayer = 1
    }


    for (let i = 0; i < 5; i++) {
        if (Game().players[checkPlayer].ships[i].location.coveredFields.includes(field)) {
            return true;
        }
    }
    return false
}



async function handleDeleteGame(e) {
    setLoading(true);
    e.preventDefault();
    const response = await deleteGame(Game()._id)
    if (response) {
        setGame(null);
        window.location.href = "/";
    }

    setLoading(false);
}



