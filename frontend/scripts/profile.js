import { isLoading, getUser } from "./state.js";

document.getElementById('username').innerHTML = "Username: " + `${getUser().username}`; 
document.getElementById('userId').innerHTML = "User ID: " + `${getUser().id}`; 
document.getElementById('email').innerHTML = "Email: " + `${getUser().email}`; 
