import { isLoggedIn, setIsLoggedIn, getUser, setUser } from './state.js'
console.log(isLoggedIn())


if (!isLoggedIn()) {
    document.getElementById("joinGame").style.visibility = "hidden"
    document.getElementById("createGame").style.visibility = "hidden"
    document.getElementById("profileButton").style.visibility = "hidden"
    document.getElementById("signOut").style.visibility = "hidden"

} else if (isLoggedIn()) {
    document.getElementById("joinGame").style.visibility = "visible"
    document.getElementById("createGame").style.visibility = "visible"
    document.getElementById("profileButton").style.visibility = "visible"
    document.getElementById("login").style.visibility = "hidden"
}

const signOutButton = document.getElementById("signOut");
signOutButton.addEventListener("click", signOut)

function signOut() {
    setUser(null);
    setIsLoggedIn(false);
    console.log("logOut")
    window.location.reload()
}