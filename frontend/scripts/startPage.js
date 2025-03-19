/** @module register */

import { User, setUser } from './utility/state.js'
import { getElementById } from './utility/helperFunctions.js'

// Helper function to show/hide an element by removing or adding the 'hidden' class
function showElement(id) {
    getElementById(id).classList.remove('hidden');
}

function hideElement(id) {
    getElementById(id).classList.add('hidden');
}

// Adjust display based on login state
if (User()) {
    hideElement("login");
    showElement("joinGame");
    showElement("createGame");
    showElement("signOut");
    showElement("settings");
    showElement("profileButton");
} else {
    showElement("login");
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

