/** @module state */

/**
 * Gets the user from the browser local storage
 * @function
 * @returns {object|null} 'user' object with email, name and id
 */
export const User = () => {
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user) : null;
}

/**
 *  SAVES THE USER IN BROWSER STORAGE, SO WE WONT GET LOGGED OUT EACH TIME WE LEAVE PAGE
 * @function
 * @param {object|null} user - object with user data
 */
export function setUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
}





/**
 * gets the volume settings from browser storage
 * @function
 * @returns {String|null} - volume settings
 */
export function volume() {
    const vol = localStorage.getItem("volume")
    return vol ? JSON.parse(vol) : null;
}

/**
 * saves the volume settings in browser storage
 * @function
 * @param {String} volume
 */
export function setVolume(volume) {
    if (volume) {
        localStorage.setItem("volume", JSON.stringify(volume));
    }
}



