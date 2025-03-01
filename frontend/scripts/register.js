import { isLoading, setUser, getUser } from './state.js';

const registerForm = document.getElementById("registerForm");

const username = document.getElementById("username").value
const password = document.getElementById("password").value
const email = document.getElementById("email").value



async function registerUser() {
    try {
        isLoading(true);
        const user = { username: username, password: password, id: generateUserId() }
        // API CALL TO REGISTER USER

        //Update frontend userState

        setUser(user);
        console.log(user)
    }

    catch {
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



