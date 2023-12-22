const { Schema, model } = require("mongoose");

const rosterSpotSchema = new Schema({
  team: {
    type: String,
    required: true,
  },
  playerId: {
    type: String,
    required: true,
    unique: true,
  }
});

const RosterSpot = model("RosterSpot", rosterSpotSchema);

module.exports = RosterSpot;
