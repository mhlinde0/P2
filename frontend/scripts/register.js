import { isLoading, setUser, getUser, setIsLoggedIn } from './state.js';

const registerForm = document.getElementById("registerForm");

registerForm?.addEventListener("submit", (e) => {
    e.preventDefault()
    registerUser();
})

async function registerUser() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const repeatPassword = document.getElementById("password").value
    const email = document.getElementById("email").value

    try {
        isLoading(true);
        const User = { username: username, email: email, password: password, id: generateUserId() }


        // API CALL TO REGISTER USER

        // Update frontend userState
        setUser(User);
        setIsLoggedIn(true);
        console.log("usr", getUser());
        window.location.href = "/"; // go to front page
    }

    catch(err) {
        console.log(err);
    }
    isLoading(false);
}

/* Generates size 10 userId, with a-Z and 1-9*/
function generateUserId() {
    let userId = ""
    let characters = [];

    for (let i = 1; i <= 9; i++) {
        characters.push(String(i))
    }

    // gets all char from a-Z
    for (let i = 65; i <= 122; i++) {
        if (i < 91 || i > 96) { // skip "[, \/, ^," ...
            characters.push(String.fromCharCode(i))
        }
    }

    for (let i = 0; i < 10; i++) {
        const length = characters.length;
        userId += characters[Math.floor(Math.random() * length)]
    }
    return userId;
}

export {generateUserId}