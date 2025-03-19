/** @module login */
import { setLoading } from './utility/ui.js';
import { setUser, User } from './utility/state.js';
import { getElementById, getInputElement, getCookie, setCookie } from './utility/helperFunctions.js';


const loginForm = getElementById("loginForm");
const rememberMeBox = getInputElement("rememberMe");
const apiBase = '/'

document.addEventListener("DOMContentLoaded", getUserCookies);

/** gets the username and passwords values that are saved in the cookies
 * @function
 */
function getUserCookies(e) {
    e.preventDefault();
    if (getCookie("rememberMe") === "true") {
        getInputElement("username").value = getCookie("username");
        getInputElement("password").value = getCookie("password");
        rememberMeBox.checked = true;
    }
}

/** sets the username and password cookies for the user
 * @function
 */
function setUserCookies(username, password) {
    if (rememberMeBox.checked) {
        setCookie("username", username, 5);
        setCookie("password", password, 5);
        setCookie("rememberMe", true, 5);
    } else {
        setCookie("username", "", -1);
        setCookie("password", "", -1);
        setCookie("rememberMe", "", -1);
    }
}


loginForm.addEventListener("submit", login)


/** calls the database for user validation and then sets the user in the frontend to a user object returned by the database
 * @function
 * @param {Event} e
 */
async function login(e) {
    e.preventDefault();

    const username = getInputElement("username").value;
    const password = getInputElement("password").value;
    try {
        setLoading(true);


        const response = await fetch(apiBase + 'auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username, password: password })
        })
        let data = await response.json()

        if (!response.ok) {
            window.alert(`${response.status}: Invalid username or password`);
            throw new Error("User not found");
        }

        console.log("Fetched User: ", data);

        // Update frontend userState
        setUser(data.user);
        //setIsLoggedIn(true);
        setUserCookies(username, password);
        window.location.href = "/"; // go to front page
    }
    catch (err) {
        console.log(err);
    }
    setLoading(false);
}

