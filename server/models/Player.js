// Player.js
const { Schema, model } = require("mongoose");

const playerSchema = new Schema({
  playerId: {
    type: String, // playerId as a string
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  abbreviatedName: {
    type: String,
    required: true,
  },
  college: {
    type: String,
  },
  birthdate: {
    type: String,
  },
  position: {
    type: String,
    required: true,
  },
  boxScores : [
    {
      type: Schema.Types.ObjectId,
      ref: "BoxScore",
    },
  ],
});

const Player = model("Player", playerSchema);

module.exports = Player;
