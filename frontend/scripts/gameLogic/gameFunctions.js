const apiBase = '/';

/**
 * 
 * @param {string} userId 
 * @param {string} gameCode 
 */
export async function createGame(userId, gameCode, name) {

    try {
        const response = await fetch(apiBase + "game/create", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: userId, gameCode: gameCode, name: name })
        });

        if (!response.ok) {
            window.alert(response.statusText)
            throw new Error(`Server error: ${response.status}`);
        }

        const gameData = await response.json();

        return gameData;


    } catch (error) {
        console.error("Error creating game:", error);
    }
}

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
 * Sends a POST request to join a game using the provided lobby code and user ID.
 * @param {string} userId - The user's ID.
 * @param {string} gameCode - The game code entered by the user.
 */
export async function joinGame(userId, gameCode, name) {

    try {
        const response = await fetch(apiBase + "game/join", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, gameCode, name })
        });

        if (!response.ok) {
            window.alert(response.statusText)
            throw new Error(`Server error: ${response.status}`);
        }

        const gameData = await response.json();

        return gameData;

    } catch (error) {
        console.error("Error joining game:", error);
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

