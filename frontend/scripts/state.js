let states = {
    isLoading: false,
    isLoggedIn: true, // 
    user: null, // keeps the current user object
}

function saveState() {
    localStorage.setItem("states", JSON.stringify(states));
}
function getStates() {
    const storedState = JSON.parse(localStorage.getItem("states")) || {isLoading: false, isLoggedIn: false, user: null};
    return storedState
}

export function getUser() {
    states = getStates()
    
    return states.user;
}

export function setUser(user) {
    states.user = user;
    saveState();
}

export function isLoggedIn() {
    return states.isLoggedIn;
}

export function setIsLoggedIn(bool) {
    states.isLoggedIn = bool;
}

function displayLoader(e) {
    const loader = document.createElement("div")
    loader.id = "loader";
    document.body.appendChild(loader);

    const screenCover = document.createElement("div")
    screenCover.id = "screenCover";
    document.body.appendChild(screenCover);
}

function removeLoader() {
    document.body.removeChild(document.getElementById("loader"))
    document.body.removeChild(document.getElementById("screenCover"))

}

export function isLoading(bool) {
    console.log("setting isLoading to", bool)
    states.isLoading = bool;

    if (bool) {
        displayLoader();
    } else {
        removeLoader();
    }
 
}

