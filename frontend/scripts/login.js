import { setCookie, getCookie } from './cookies.js';
import { isLoading, setUser, getUser, setIsLoggedIn } from './state.js';

const loginForm = document.getElementById("loginForm");
const rememberMeBox = document.getElementById("rememberMe");

document.addEventListener("DOMContentLoaded", rememberMe)

function rememberMe(e) {
    e.preventDefault();
    if (getCookie("rememberMe") === "true") {
        document.getElementById("username").value = getCookie("username");
        document.getElementById("password").value = getCookie("password");
        rememberMeBox.checked = true;
    }
}

function setRememberMeCookies() {
    const username = document.getElementById("username").value
    const password = document.getElementById("password").value
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

loginForm.addEventListener("submit", (e) => {
    e.preventDefault()
    login();
})

async function login() {
    const username = document.getElementById("username").value
    const password = document.getElementById("password").value
    try {
        isLoading(true);

        // API CALL TO LOGIN

        //Update frontend userState

        setUser(username);
        console.log("user", getUser())
        if (getUser()) {
            setIsLoggedIn(true);
            console.log("is signed in")
        }
        setRememberMeCookies();
        window.location.href = "/"
    }
    catch (err) {
        console.log(err);
    }
    isLoading(false);
}

