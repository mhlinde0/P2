import { deleteGame } from "./gameFunctions.js";
import { Game, setGame } from "../utility/state.js";
import { getElementById } from "../utility/helperFunctions.js";
import { setLoading } from "../utility/ui.js";






getElementById("cancelButton").addEventListener("click", handleDeleteGame)

async function handleDeleteGame(e) {
    e.preventDefault()
    setLoading(true)
    const isDeleted = await deleteGame(Game()._id);

    if (isDeleted) {
        setGame(null)
        window.location.href = "/"
    } else {
        window.alert("could not delete game");
    }
    setLoading(false);
}
console.log("this is the right script")