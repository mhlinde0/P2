import { User } from "./state.js";

if (!User()) {
    window.location.href = "/login"; // go to front page
}


document.getElementById('username').innerHTML = "Username: " + `${User().name}`; 
document.getElementById('userId').innerHTML = "User ID: " + `${User()._id}`; 
document.getElementById('email').innerHTML = "Email: " + `${User().email}`; 
