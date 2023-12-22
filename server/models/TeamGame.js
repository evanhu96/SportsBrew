// TeamGame.js
const { Schema, model } = require('mongoose');

const teamGameSchema = new Schema({
  team: {
    type: String,
    required: true,
  },
  scoreByQuarter: {
    type: Object,
    required: true,
  },
  vsScoreByQuarter: {
    type: Object,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  vsScore: {
    type: Number,
    required: true,
  },
  gameId: {
    type: String,
    ref: 'Game',
    required: true,
  },
});

const TeamGame = model('TeamGame', teamGameSchema);

module.exports = TeamGame;
