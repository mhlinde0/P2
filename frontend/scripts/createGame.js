import './audioManager.js'

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('gameId').innerHTML = "GAME ID: " + generateGameId();
});

// Generates random 6 character ID
function generateGameId() {
    let gameId = ""

    for (let i = 0; i < 6; i++) {
        if (Math.random()<0.5) {
            const randomLetterCode = Math.floor(Math.random()*25)+65; 
            gameId += String.fromCharCode(randomLetterCode) 
        } else {
            gameId += String(Math.floor(Math.random()*9))
        }   
    }
    return gameId;
}