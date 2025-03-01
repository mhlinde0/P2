import './audioManager.js'
import { isLoading, getUser } from "./state.js";

document.getElementById('username').innerHTML = "Username: " + `${getUser()}`; 
