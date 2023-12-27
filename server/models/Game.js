const { Schema, model } = require("mongoose");

const gameSchema = new Schema({
  gameId: {
    type: String,
    required: true,
    unique: true,
  },
  dateEpoch: {
    type: Number,
    required: true,
  },
  militaryTime: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  home: {
    type: String,
    required: true,
  },
  away: {
    type: String,
    required: true,
  },
  winner: {
    type: String,
    required: true,
  },
  loser: {
    type: String,
    required: true,
  },
  seasonType: {
    type: String,
    required: true,
  },
  refs: {
    type: [String],
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  totalByQuarter: {
    type: Object,
    required: true,
  },
  attendance: {
    type: Number,
    required: true,
  },
  OT: {
    type: Boolean,
    required: true,
  },
  teamGames: [
    {
      type: Schema.Types.ObjectId,
      ref: "TeamGame",
    },
  ],
  boxScores: [
    {
      type: Schema.Types.ObjectId,
      ref: "BoxScore",
    },
  ],
});

gameSchema.set("_id", "gameId"); // Setting gameId as the primary key

const Game = model("Game", gameSchema);

module.exports = Game;
