import express from "express";
import { createGame, joinGame, updateGame} from "../controllers/gameController.js";
import Game from "../models/game.js";

const router = express.Router();

// Route to create a new game (lobby creation)
router.post('/create', createGame);

// Route for a player to join a game using the lobby code
router.put('/join', joinGame);

// Route to update game details (e.g., ship placements and readiness)
router.put('/', updateGame);

// Route to get state of game
router.get('/state', async (req, res) => {
    try {
      const { gameId } = req.query;
      if (!gameId) {
        return res.status(400).json({ error: 'No gameId provided' });
      }
      const game = await Game.findById(gameId);
      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }
      res.status(200).json(game);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

export default router;