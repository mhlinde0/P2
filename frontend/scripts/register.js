import { setLoading, setUser, User } from './state.js';

const registerForm = document.getElementById("registerForm");

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
        setLoading(true);

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
        console.log("Response: ", data.data);

        // Update frontend userState
        setUser(data.data);
        setIsLoggedIn(true);
        console.log("New user:", User());
        window.location.href = "/"; // go to front page
    }

    catch (err) {
        console.log(err);
    }
    setLoading(false);
}


