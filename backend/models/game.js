import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Schema for a player's board (ship placements and shots fired)
const BoardSchema = new Schema({
  ships: [{
    type: { type: String, required: true },         // e.g., "destroyer", "carrier"
    positions: { type: [[Number]], required: true }   // e.g., [[0,0], [0,1]]
  }],
  shots: { type: [[Number]], default: [] }             // e.g., [[1,1], [2,2]]
}, { _id: false });

// Schema for a player in the game
const PlayerSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  board: { type: BoardSchema, default: { ships: [], shots: [] } },
  ready: { type: Boolean, default: false }
}, { _id: false });

// Main game schema
const GameSchema = new Schema({
  lobbyCode: { type: String, required: true, unique: true },
  players: {
    type: [PlayerSchema],
    required: true,
    // Allow one or two players in a game
    validate: {
      validator: function(v) {
        return v.length <= 2;
      },
      message: 'A game can have at most 2 players.'
    }
  },
  status: { type: String, enum: ['waiting', 'active', 'finished'], default: 'waiting' },
  currentTurn: { type: Schema.Types.ObjectId, ref: 'User' } // Set once both players are ready
}, { timestamps: true });

module.exports = mongoose.model('Game', GameSchema);

export default Game;