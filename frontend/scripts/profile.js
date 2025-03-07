import { isLoading, getUser } from "./state.js";

document.getElementById('username').innerHTML = "Username: " + `${getUser().name}`; 
document.getElementById('userId').innerHTML = "User ID: " + `${getUser()._id}`; 
document.getElementById('email').innerHTML = "Email: " + `${getUser().email}`; 
