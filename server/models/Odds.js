const { Schema, model } = require("mongoose");

const oddsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  away: {
    type: String,
    required: true,
  },
  home: {
    type: String,
    required: true,
  },
  overAmt: {
    type: Number,
    required: true,
  },
  underAmt: {
    type: Number,
  },
  overOdds: {
    type: String,
  },
  underOdds: {
    type: String,
  },

  prop: {
    type: String,
    required: true,
  },
});

const Odds = model("Odds", oddsSchema);

module.exports = Odds;
