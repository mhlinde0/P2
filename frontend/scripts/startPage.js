/** @module register */
import { User, setUser, Game } from './utility/state.js';
import { getElementById } from './utility/helperFunctions.js';
import {showElement, hideElement} from './utility/helperFunctions.js';
import { setLoading } from './utility/ui.js';


// checks if the user is in a game
if (Game()) {
    setLoading(true)
    setTimeout(()=>{
        window.location.href = "/game"
    },1000)
}


// Adjust display based on login state
if (User()) {
    hideElement("login");
    hideElement("register")
    showElement("joinGame");
    showElement("createGame");
    showElement("signOut");
    showElement("settings");
    showElement("profileButton");
} else {
    showElement("login");
    showElement("register")
    hideElement("joinGame");
    hideElement("createGame");
    hideElement("signOut");
    showElement("settings");
    hideElement("profileButton");
}

const signOutButton = getElementById("signOut");
signOutButton.addEventListener("click", signOut);

function signOut() {
    setUser(null); // Removes user from browser storage
    window.location.reload();
}


