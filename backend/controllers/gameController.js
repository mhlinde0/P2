import Game from "../models/game.js";


/**
 * // Create a new game (lobby creation)
 * @param {any} req 
 * @param {any} res 
 * @returns 
 */
export const createGame = async (req, res) => {
  try {
    const { gameCode, userId } = req.body;
    if (!gameCode || !userId) {
      return res.status(400).json({ error: 'gameCode and userId are required' });
    }

    // Ensure the lobby code is unique
    const existingGame = await Game.findOne({ gameCode });
    if (existingGame) {
      return res.status(400).json({ error: 'game code already in use' });
    }

    // Create a game document with the creator as the only player initially
    const newGame = new Game({
      gameCode,
      players: [{
        userId,
        board: { ships: [], shots: [] },
        ready: false
      }],
      status: 'waiting'
    });

    const savedGame = await newGame.save();
    res.status(201).json(savedGame);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Join a game using a lobby code
 * @param {any} req 
 * @param {any} res 
 * @returns 
 */
export const joinGame = async (req, res) => {
  try {
    const { gameCode, userId } = req.body;
    if (!gameCode || !userId) {
      return res.status(400).json({ error: 'gameCode and userId are required' });
    }

    const game = await Game.findOne({ gameCode });
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Check if game already has two players
    if (game.players.length >= 2) {
      return res.status(400).json({ error: 'Game already has two players' });
    }

    // Ensure the user is not already in the game
    if (game.players.some(player => player.userId.toString() === userId)) {
      return res.status(400).json({ error: 'User already joined the game' });
    }

    // pusher en player objekt til game (tilføjer p2)
    game.players.push({
      userId,
      board: { ships: [], shots: [] },
      ready: false
    });

    const updatedGame = await game.save();
    res.json(updatedGame);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};



/**
 * Update game details (e.g., updating ship placements and setting "ready")
 * @param {any} req 
 * @param {any} res 
 * @returns 
 */
export const updateGame = async (req, res) => {
  try {
    // Expect gameId to be sent in the request body (this is the _id from MongoDB)
    const { gameId, userId, board, ready } = req.body;
    console.log("Updating game with ID:", gameId); // Debug log
    
    if (!userId || !gameId) {
      return res.status(400).json({ error: 'userId and gameId are required' });
    }

    const game = await Game.findById(gameId);
    console.log("Game found:", game); // Debug log

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Find the player in the game document
    const player = game.players.find(player => player.userId.toString() === userId);
    if (!player) {
      return res.status(400).json({ error: 'User not part of this game' });
    }

    // Update board (ship placements) and readiness flag if provided
    if (board) {
      player.board = board;
    }
    if (typeof ready === 'boolean') {
      player.ready = ready;
    }

    // If both players have joined and are ready, update the game status and set the current turn
    if (game.players.length === 2 && game.players.every(p => p.ready)) {
      game.status = 'active';
      game.currentTurn = game.players[0].userId;
    }

    const updatedGame = await game.save();
    res.json(updatedGame);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};