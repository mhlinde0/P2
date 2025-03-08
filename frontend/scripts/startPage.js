import { User, setLoading, setUser } from './state.js'


console.log("User:", User)
setLoading(true)



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

setLoading(false)

const signOutButton = document.getElementById("signOut");
signOutButton.addEventListener("click", signOut)

function signOut() {
    setUser(null);
    console.log("logOut")
    window.location.reload()
}