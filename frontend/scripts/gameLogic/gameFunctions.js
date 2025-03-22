

// Checks for game status
export async function fetchGameData(gameId) {
    try {
        // Fetch from the dedicated endpoint
        const response = await fetch(`/game/data?gameId=${gameId}`);
        if (!response.ok) {
            alert("Player left game");
            throw new Error(`Server error: ${response.status}`)
        }
        
        const gameData = await response.json();

        return gameData;
    } catch (error) {
        console.error("Error fetching gameData:", error);

    }
}


/**
 * Update the game state on the backend with the player's board and ready status.
 * @param {string} gameId
 * @param {string} userId - The current user's ID.
 * @param {object} ships - The ships object including name, length, rotation and location
 * @returns {Promise<object>} - The updated game data from the backend.
 */
export async function submitShips(gameId, userId, ships) {
    try {
        const response = await fetch("/game/submitShips", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ gameId: gameId, userId: userId, ships: ships })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const updatedGame = await response.json();
        return updatedGame;
    } catch (error) {
        console.error("Error updating game:", error);
        throw error;
    }
}



export async function fireShot(gameId, field) {

    try {
        const response = await fetch("/game/fireShot", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ gameId: gameId, field: field })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const updatedGame = await response.json();
        console.log("Game updated successfully:", updatedGame);


  

    } catch (error) {
        console.error("Error updating game:", error);
        throw error;
    }
}

export async function deleteGame(gameId) {

    try {
        // Fetch from the dedicated endpoint
        const response = await fetch(`/game/delete/${gameId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`)
        };

        const data = await response.json();

        return true;

    } catch (error) {
        console.error("Error checking game state:", error);
    }
}