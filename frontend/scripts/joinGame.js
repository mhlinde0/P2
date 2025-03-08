import { User } from "./state";

if (!User()) {
    window.location.href = "/login"; // 
}

const form = document.querySelector('form');


form.addEventListener("submit", (e) => {
    e.preventDefault();
    findGame()
})

function findGame() {
    const battleNumber = document.querySelector('input').value;

    if (battleNumber.length === 6) {
        window.location.replace(`/Game:${battleNumber}`);
    }
}