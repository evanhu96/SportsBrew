// Ranking.js
const { Schema, model } = require("mongoose");
function validateNaN(value) {
  return value === null || value === undefined || typeof value === "number";
}
const rankingSchema = new Schema({
  name: {
    type: String,
  },
  playerId: {
    type: String,
    ref: "Player", // Reference to the Player model
  },
  type: {
    type: String,
    required: true,
  },
  team: {
    type: String,
  },
  MIN: {
    type: Object,
  },
  FGA: {
    type: Object,
  },
  FGM: {
    type: Object,
  },
  "3PTA": {
    type: Object,
  },
  "3PTM": {
    type: Object,
  },
  FTA: {
    type: Object,
  },
  FTM: {
    type: Object,
  },
  OREB: {
    type: Object,
  },
  DREB: {
    type: Object,
  },
  REB: {
    type: Object,
  },
  AST: {
    type: Object,
  },
  STL: {
    type: Object,
  },
  BLK: {
    type: Object,
  },
  TO: {
    type: Object,
  },
  PF: {
    type: Object,
  },
  "+/-": {
    type: Object,
  },
  PTS: {
    type: Object,
  },
  vsScore: {
    type: Object,
  },
});
const Ranking = model("Ranking", rankingSchema);
module.exports = Ranking;
