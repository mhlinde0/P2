import { User, setUser } from './state.js'

/* CHANGE DISPLAY IF USER IS NOT LOGGED IN*/
if (User()) {
    document.getElementById("joinGame").style.visibility = "visible"
    document.getElementById("createGame").style.visibility = "visible"
    document.getElementById("profileButton").style.visibility = "visible"
    document.getElementById("login").style.visibility = "hidden"

} else {
    document.getElementById("joinGame").style.visibility = "hidden"
    document.getElementById("createGame").style.visibility = "hidden"
    document.getElementById("profileButton").style.visibility = "hidden"
    document.getElementById("signOut").style.visibility = "hidden"
}


const signOutButton = document.getElementById("signOut");
signOutButton.addEventListener("click", signOut)

function signOut() {
    setUser(null); // Removes user from browser storage
    window.location.reload()
}