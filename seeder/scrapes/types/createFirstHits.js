const FirstHit = require("../../../server/models/FirstHit");
const Play = require("../../../server/models/Play");
async function main(gameId) {
  try {
    const gamePlays = await Play.find({ gameId }).lean();
    const types = [
      "assist",
      "block",
      "foul",
      "make",
      "reb",
      "steal",
      "timeout",
      "turnover",
      "subOut",
      "subIn",
    ];
    // distinct set of player ids in gameplays
    const playerIdsSet = new Set();
    gamePlays.forEach((play) => {
      if (
        play.playerId !== "coach" &&
        play.playerId !== "vs" &&
        play.playerId !== "unknown" &&
        play.playerId !== "Double technical" &&
        play.playerId !== play.team &&
        play.type !== "team"
      ) {
        playerIdsSet.add(play.playerId);
      }
    });
    // for each player for each type find play with lowest secondsIntoGame prop
    const playerIds = Array.from(playerIdsSet);
    const firstHits = [];
    for (const playerId of playerIds) {
      const firstHitObject = { playerId, gameId };

      for (const type of types) {
        const plays = gamePlays.filter(
          (play) => play.playerId === playerId && play.type === type
        );
        if (plays.length) {
          const firstHit = plays.reduce((prev, current) =>
            prev.secondsIntoGame < current.secondsIntoGame ? prev : current
          );
          firstHitObject[type] = firstHit.secondsIntoGame;
        }
      }
      firstHits.push(firstHitObject);
    }
    await FirstHit.insertMany(firstHits);
  } catch (error) {
    // Handle errors
    console.error(error);
  }
}
module.exports = main;
