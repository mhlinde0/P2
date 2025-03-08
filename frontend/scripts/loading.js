// loading state
let isLoading = false;

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

export const setLoading = (bool) => {
    isLoading = bool;
    if (bool) {
        displayLoader();
    } else {
        removeLoader();
    }
 
}