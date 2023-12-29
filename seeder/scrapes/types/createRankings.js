const Rankings = require("../../../server/models/Rankings");
const {
  dailyAveragesPlayers,
  dailyAveragesTeams,
} = require("../../aggregates");
async function main() {
  try {
    console.log("inside rankings");
    const players = await dailyAveragesPlayers();
    console.log("Players created");
    const teams = await dailyAveragesTeams();
    // console.log(players);
    await Rankings.deleteMany({});
    console.log("Rankings deleted");
    await Rankings.insertMany([...players, ...teams]);
    console.log("Rankings created");
  } catch (error) {
    // Handle errors
    console.error(error);
  }
}
module.exports = main;
