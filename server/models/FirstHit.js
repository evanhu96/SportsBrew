// FirstHits.js
const { Schema, model } = require("mongoose");

const firstHitsSchema = new Schema({
  playerId: {
    type: String, // firstHitserId as a string
    ref: "player", // Reference to the FirstHitser model
    required: true,
  },
  gameId: {
    type: String, // gameId as a string
    ref: "Game", // Reference to the Game model
    required: true,
  },
  make:{
    type: Number,
  },
  assist: {
    type: Number,
  },
  block: {
    type: Number,
  },
  foul: {
    type: Number,
  },
  reb: {
    type: Number,
  },
  steal: {
    type: Number,
  },
  timeout: {
    type: Number,
  },
  turnover: {
    type: Number,
  },
  subOut: {
    type: Number,
  },
  subIn: {
    type: Number,
  },

});

const FirstHits = model("FirstHits", firstHitsSchema);

module.exports = FirstHits;
