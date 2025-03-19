import express from "express";
import { createGame, joinGame, updateGame, getGameData} from "../controllers/gameController.js";
import Game from "../models/game.js";


const router = express.Router();

// Route to create a new game (lobby creation)
router.post('/create', createGame);

// Route for a player to join a game using the lobby code
router.put('/join', joinGame);

// Route to update game details (e.g., ship placements and readiness)
router.put('/', updateGame);

// Route to get data of game
router.get('/data', getGameData);

export default router;