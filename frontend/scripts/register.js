import { isLoading, setUser, getUser, setIsLoggedIn } from './state.js';

const registerForm = document.getElementById("registerForm");
const apiBase = '/'

registerForm?.addEventListener("submit", (e) => {
    e.preventDefault()
    registerUser();
})

async function registerUser() {
    const user = { 
        name: document.getElementById("username").value, 
        email: document.getElementById("email").value, 
        password: document.getElementById("password").value, 
    }
    console.log("user: ", user)
    try {
        let data
        isLoading(true);
        const response = await fetch(apiBase + 'auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        })
        data = await response.json()

        console.log("Response: ", data.data);

        // Update frontend userState
        setUser(data.data);
        setIsLoggedIn(true);
        console.log("New user:", getUser());
        window.location.href = "/"; // go to front page
    }

    catch (err) {
        console.log(err);
    }
    isLoading(false);
}


