// Play.js
const { Schema, model } = require("mongoose");

const playSchema = new Schema({
  playerId: {
    type: String, // playerId as a string
    ref: "Player", // Reference to the Player model
    required: true,
  },
  gameId: {
    type: String, // gameId as a string
    ref: "Game", // Reference to the Game model
    required: true,
  },
  secondsIntoGame: {
    type: Number,
    required: true,
  },
  quarter: {
    type: String,
    required: true,
  },
  minute: {
    type: Number,
    required: true,
  },
  second: {
    type: Number,
    required: true,
  },
  team: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  awayScore: {
    type: Number,
    required: true,
  },
  homeScore: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  turnoverType: {
    type: String,
    required: false,
  },
  side: {
    type: String,
    required: false,
  },
  value: {
    type: Number,
    required: false,
  },
  shotType: {
    type: String,
    required: false,
  },
  timeOutType: {
    type: String,
    required: false,
  },
  foulType: {
    type: String,
    required: false,
  },
});

const Play = model("Play", playSchema);

module.exports = Play;
