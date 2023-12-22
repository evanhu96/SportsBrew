// BoxScore.js
const { Schema, model } = require("mongoose");
function validateNaN(value) {
  return value === null || value === undefined || typeof value === "number";
}
const boxScoreSchema = new Schema({
  name: {
    type: String,
  },
  position: {
    type: String,
  },
  starter: {
    type: Boolean,
  },
  playerId: {
    type: String,
    ref: "Player", // Reference to the Player model
  },
  gameId: {
    type: String,
    ref: "Game", // Reference to the Player model
    required: true,
  },
  MIN: {
    type: Number,
  },
  team: {
    type: String,
    required: true,
  },
  PTS: {
    type: Number,
  },
  FGA: {
    type: Number,
  },
  FGM: {
    type: Number,
  },
  "3PTA": {
    type: Number,
  },
  "3PTM": {
    type: Number,
  },
  FTA: {
    type: Number,
  },
  FTM: {
    type: Number,
  },
  OREB: {
    type: Number,
  },
  DREB: {
    type: Number,
  },
  REB: {
    type: Number,
  },
  AST: {
    type: Number,
  },
  STL: {
    type: Number,
  },
  BLK: {
    type: Number,
  },
  TO: {
    type: Number,
  },
  PF: {
    type: Number,
  },
  "+/-": {
    type: Number,
  },
});
const BoxScore = model("BoxScore", boxScoreSchema);
module.exports = BoxScore;
