const form = document.querySelector('form');

form.addEventListener("submit", (e) => {
    e.preventDefault();
    findGame()
})

function findGame() {
    const gameId = document.querySelector('input').value;

    if (gameId.length === 6) {
        window.location.replace(`/Game:${gameId}`);
    }
}