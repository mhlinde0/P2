import './audioManager.js'
import { isLoggedIn, setIsLoggedIn, getUser, setUser } from './state.js'

setUser('brian');
console.log(getUser())

document.addEventListener("click", () => {
    isLoggedIn() ? setIsLoggedIn(false) : setIsLoggedIn(true);
    console.log("logged in?", isLoggedIn())
})

if (!isLoggedIn()) {
    document.getElementById("joinGame").style.visibility = "hidden"
    document.getElementById("createGame").style.visibility = "hidden"
    document.getElementById("profileButton").style.visibility = "hidden"
} else if (isLoggedIn()) {
    document.getElementById("joinGame").style.visibility = "visible"
    document.getElementById("createGame").style.visibility = "visible"
    document.getElementById("profileButton").style.visibility = "visible"

}