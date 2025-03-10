import { setUser, User } from './state.js';
import { setLoading } from './loading.js';
const registerForm = document.getElementById("registerForm");
const apiBase = '/'

registerForm?.addEventListener("submit", (e) => {
    e.preventDefault()

    if (isValidPassword()) {
        registerUser();
    }
})


function isValidPassword() {
    const upperLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const password = document.getElementById("password").value;
    const repeatPassword = document.getElementById("repeatPassword").value;

    if (!password || !repeatPassword) {
        window.alert("Invalid password")
        err("element returned null")
        return false;
    }
    
    if (password.length < 6) {
        document.getElementById("password").style.border = "1px solid red"
        window.alert("Passwords must contain at least 6 characters")
        return false
    }

    if (password !== repeatPassword) {
        document.getElementById("repeatPassword").style.border = "1px solid red"

        window.alert("Passwords do not match")
        return false
    }

    return true;
}

async function registerUser() {
    const user = {
        name: document.getElementById("username").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
    }

    try {
        let data
        setLoading(true);

        // API CALL TO REGISTER USER
        const response = await fetch(apiBase + 'auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        })
        data = await response.json()

        if (!response.ok) {
            throw new Error("User could not be registered");
        }

        console.log("Response: ", data.data);

        // Update frontend userState
        setUser(data.data);
        //setIsLoggedIn(true);
        console.log("New user:", User());
        window.location.href = "/"; // go to front page
    }

    catch (err) {
        console.log(err);
    }
    setLoading(false);
}


