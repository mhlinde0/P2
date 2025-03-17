import Game from "../models/game.js";

// Create a new game (lobby creation)
exports.createGame = async (req, res) => {
  try {
    const { lobbyCode, userId } = req.body;
    if (!lobbyCode || !userId) {
      return res.status(400).json({ error: 'lobbyCode and userId are required' });
    }

    // Ensure the lobby code is unique
    const existingGame = await Game.findOne({ lobbyCode });
    if (existingGame) {
      return res.status(400).json({ error: 'Lobby code already in use' });
    }

    // Create a game document with the creator as the only player initially
    const newGame = new Game({
      lobbyCode,
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




// Join a game using a lobby code
exports.joinGame = async (req, res) => {
  try {
    const { lobbyCode, userId } = req.body;
    if (!lobbyCode || !userId) {
      return res.status(400).json({ error: 'lobbyCode and userId are required' });
    }

    const game = await Game.findOne({ lobbyCode });
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




// Update game details (e.g., updating ship placements and setting "ready")
exports.updateGame = async (req, res) => {
  try {
    const gameId = req.params.id;
    const { userId, board, ready } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const game = await Game.findById(gameId);
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
      // Set currentTurn to one of the players (e.g., the first one)
      game.currentTurn = game.players[0].userId;
    }

    const updatedGame = await game.save();
    res.json(updatedGame);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};