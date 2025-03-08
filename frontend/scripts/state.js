/* GETS THE USER FROM BROWSER STORAGE TO CHECK IF LOGGED IN*/
export const User = () => {
    return JSON.parse(localStorage.getItem("user")) || null;
}

/* SAVES THE USER IN BROWSER STORAGE, SO WE WONT GET LOGGED OUT EACH TIME WE LEAVE PAGE*/
export function setUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
}

/* GETS THE GAME FROM BROWSER STORAGE */
export const Game = () => {
    return JSON.parse(localStorage.getItem("game")) || null;
}

/* SAVES THE GAME FROM BROWSER STORAGE */
export function saveGame(game) {
    localStorage.setItem("game", JSON.stringify(game));
}

/* GETS VOLUME SETTINGS FROM BROWSER */
export function volume() {
    return JSON.parse(localStorage.getItem("volume")) || null;
}

/* SAVES VOLUME SETTINGS IN BROWSER */
export function setVolume(volume) {
    localStorage.setItem("volume", JSON.stringify(volume));
}

/* GETS VOLUME SETTINGS FROM BROWSER */
export function darkMode() {
    return JSON.parse(localStorage.getItem("darkMode")) || false;
}

/* SAVES VOLUME SETTINGS IN BROWSER */
export function setDarkMode(bool) {
    localStorage.setItem("darkMode", JSON.stringify(bool));
}



