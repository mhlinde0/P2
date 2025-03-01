const gameStates = {
    isLoading: false,
    isLoggedIn: false, // 
    user: null, // keeps the current user logged in
}

function displayLoader(e) {
    const loader = document.createElement("div")
    loader.id = "loader";
    document.body.appendChild(loader);
    console.log("loader", loader)

    const screenCover = document.createElement("div")
    screenCover.id = "screenCover";
    document.body.appendChild(screenCover);
    console.log("loader", screenCover)
}

function removeLoader() {
    document.body.removeChild(document.getElementById("loader"))
    document.body.removeChild(document.getElementById("screenCover"))

}
export function isLoading(bool) {
    console.log("setting isLoading to", bool)
    gameStates.isLoading = bool;

    if (bool) {
        displayLoader();
    } else {
        removeLoader();
    }
 
}

