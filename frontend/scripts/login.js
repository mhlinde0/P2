
import { setCookie, getCookie } from './cookies.js';
import { setLoading } from './loading.js';
import { setUser, User } from './state.js';
import { getElementById, getInputElement } from './helperFunctions.js';

const loginForm = getElementById("loginForm");
const rememberMeBox = getInputElement("rememberMe");
const apiBase = '/'

document.addEventListener("DOMContentLoaded", rememberMe);

function rememberMe(e) {
    e.preventDefault();
    if (getCookie("rememberMe") === "true") {
        getInputElement("username").value = getCookie("username");
        getInputElement("password").value = getCookie("password");
        rememberMeBox.checked = true;
    }
}

function setRememberMeCookies() {
    const username = getInputElement("username").value;
    const password = getInputElement("password").value;
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

loginForm?.addEventListener("submit", (e) => {
    e.preventDefault()
    login();
})

async function login() {
    const username = getInputElement("username").value
    const password = getInputElement("password").value
    try {
        setLoading(true);

        let data
        const response = await fetch(apiBase + 'auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username, password: password })
        })
        data = await response.json()

        if (!response.ok) {
            window.alert(`${response.status}: Invalid username or password`);
            throw new Error("User not found");
        }

        console.log("Fetched User: ", data);

        // Update frontend userState
        setUser(data.user);
        console.log("user set", User())
        //setIsLoggedIn(true);
        setRememberMeCookies();
        window.location.href = "/"; // go to front page
    }
    catch (err) {
        console.log(err);
    }
    setLoading(false);
}

