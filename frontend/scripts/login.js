import { setCookie, getCookie } from './cookies.js';
import { isLoading, setUser, getUser } from './state.js';

const loginForm = document.getElementById("loginForm");
const rememberMeBox = document.getElementById("rememberMe");

const username = document.getElementById("username").value
const password = document.getElementById("password").value


document.addEventListener("DOMContentLoaded", (e) => {
    e.preventDefault();
    if (getCookie("rememberMe") === "true") {
        document.getElementById("username").value = getCookie("username");
        document.getElementById("password").value = getCookie("password");

        rememberMeBox.checked = true;
    }
})


loginForm?.addEventListener("submit", function (event) {
    event?.preventDefault();


    if (rememberMeBox.checked) {
        setCookie("username", username, 5);
        setCookie("password", password, 5);
        setCookie("rememberMe", true, 5);
    } else {
        setCookie("username", "", -1);
        setCookie("password", "", -1);
        setCookie("rememberMe", "", -1);
    }

})


async function login() {
    try {
        isLoading(true);

        // API CALL TO LOGIN


        //Update frontend userState

        setUser(user);

    }
    catch (err) {
        console.log(err);
    }
    isLoading(false);
}

