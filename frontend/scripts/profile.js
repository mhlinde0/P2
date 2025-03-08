import { User } from "./state.js";

document.getElementById('username').innerHTML = "Username: " + `${User().name}`; 
document.getElementById('userId').innerHTML = "User ID: " + `${User()._id}`; 
document.getElementById('email').innerHTML = "Email: " + `${User().email}`; 
