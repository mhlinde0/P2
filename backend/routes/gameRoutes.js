import express from "express";
import gameController from "../controllers/gameController";

const router = express.Router();

// Route to create a new game (lobby creation)
router.post('/create', gameController.createGame);

// Route for a player to join a game using the lobby code
router.put('/join', gameController.joinGame);

// Route to update game details (e.g., ship placements and readiness)
router.put('/:id', gameController.updateGame);

export default router;