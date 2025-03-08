export const GameStates = Object.freeze({
    NOT_IN_GAME: 'notInGame',
    GAME_CREATED: 'gameCreated',
    IN_GAME: 'inGame'
});

const defaultStates = {
    volume: 1,
    gameState: GameStates.NOT_IN_GAME,
    currentBattleNumber: null,
}

let states = defaultStates;
let isLoading = false;

function saveState() {
    localStorage.setItem("states", JSON.stringify(states));
}

function getStates() {
    states = JSON.parse(localStorage.getItem("states")) || defaultStates;
}

export const User = () => {
    return JSON.parse(localStorage.getItem("user")) || null;
}

export function setUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
    saveState();
}


export function volume() {
    getStates()
    return states.volume;
}

export function setVolume(vol) {
    states.volume = vol;
    saveState()
}

export function getGameState() {
    getStates()
    return states.gameState;
}

export function setGameState(gameState) {
    states.gameState = gameState;
    saveState()
}

export function getBattleNumber() {
    getStates()
    return states.currentBattleNumber;
}

export function setBattleNumber(id) {
    states.currentBattleNumber = id;
    saveState()
}

/* LOAD SCREEN*/
function displayLoader(e) {
    const loader = document.createElement("div")
    loader.id = "loader";
    document.body.appendChild(loader);

    const screenCover = document.createElement("div")
    screenCover.id = "screenCover";
    document.body.appendChild(screenCover);
}

function removeLoader() {
    document.body.removeChild(document.getElementById("loader"))
    document.body.removeChild(document.getElementById("screenCover"))

}

export const setLoading = (bool) => {
    isLoading = bool;
    if (bool) {
        displayLoader();
    } else {
        removeLoader();
    }
 
}

