const defaultStates = {
    isLoading: false,
    isLoggedIn: true, // 
    user: null, // keeps the current user object
    volume: 1,
}

let states = defaultStates;

function saveState() {
    localStorage.setItem("states", JSON.stringify(states));
}
function getStates() {
    states = JSON.parse(localStorage.getItem("states")) || defaultStates;
}

export function getUser() {
    getStates()
    return states.user;
}

export function setUser(user) {
    states.user = user;
    saveState();
}

export function isLoggedIn() {
    getStates()
    return states.isLoggedIn;
}

export function setIsLoggedIn(bool) {
    states.isLoggedIn = bool;
    saveState()
}

export function volume() {
    getStates()
    return states.volume;
}

export function setVolume(vol) {
    states.volume = vol;
    saveState()
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

