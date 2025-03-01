import {setUser, getUser, setIsLoggedIn, isLoggedIn} from './state.js'

document.addEventListener("DOMContentLoaded", function() {
    const setCookie = (name, value, days) => {
        const date = new Date();

        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        const expires = "expires=" + date.toUTCString();
        document.cookie = `${name}=${value}; ${expires}; path=/`;
    };

    const getCookie = (name) => {
        return document.cookie
            .split(';')
            .map(cookie => cookie.trim())
            .find(cookie => cookie.startsWith(name + "="))
            ?.split('=')[1] || "";
    };

    const loginForm = document.getElementById("loginForm");
    const rememberMeBox = document.getElementById("rememberMe");

    if (getCookie("rememberMe") === "true") {

        document.getElementById("username").value = getCookie("username");
        document.getElementById("password").value = getCookie("password");

        rememberMeBox.checked = true;
    }

    loginForm?.addEventListener("submit", function(event) {



        event?.preventDefault();

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

        setUser(username);
        setIsLoggedIn(true);
        console.log("user", username)

    })

})
