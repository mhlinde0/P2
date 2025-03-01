import { isLoading, getUser } from "./state.js";

document.getElementById('username').innerHTML = "Username: " + `${getUser()}`; 
console.log("hello"); 