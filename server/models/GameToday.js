const { Schema, model } = require("mongoose");

const gameTodaySchema = new Schema({
  home: {
    type: String,
    required: true,
  },
  away: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

const GameToday = model("GameToday", gameTodaySchema);

module.exports = GameToday;
