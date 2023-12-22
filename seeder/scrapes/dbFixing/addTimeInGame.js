const Play = require("../../models/Play");
const db = require("../../config/connection");



// get distinct games
// go through each game and and get distinct players
// for each player, go through each play
// sorted by secondsIntoGame prop create a total time in game prop














db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async () => {
  try {
    const plays = await Play.find({});

    for (const play of plays) {
      if (play.playerId[0] === "(") {
        console.log(`Updated playerId ${play.playerId} to team property`);
        play.playerId = play.team;
        await play.save();

      }
    }
    console.log("Success!");
  } catch (err) {
    console.error("Error retrieving unique player IDs:", err);
  } finally {
    // Close the connection after updating data
    db.close();
  }
});
