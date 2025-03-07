import { isLoading, setUser, getUser, setIsLoggedIn } from './state.js';

const registerForm = document.getElementById("registerForm");

registerForm?.addEventListener("submit", (e) => {
    e.preventDefault()
    registerUser();
})

async function registerUser() {
    const user = { 
        name: document.getElementById("username").value, 
        email: document.getElementById("password").value, 
        password: document.getElementById("email").value, 
    }
    console.log("user: ", user)
    try {
        isLoading(true);

        // API CALL TO REGISTER USER
        const route = "/routes/api/userroutes/register/"

        const response = await fetch(route, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });

        if (!response.ok) {
            throw new Error("User could not be registeredfound");
        }

        const data = await response.json();
        console.log("Response: ", data);

        // Update frontend userState
        setUser(user);
        console.log("current user", user)
        setIsLoggedIn(true);
        console.log("usr", getUser());
        // window.location.href = "/"; // go to front page
    }

    catch (err) {
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

export { generateUserId }