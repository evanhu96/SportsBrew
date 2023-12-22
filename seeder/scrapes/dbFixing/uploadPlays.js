const Play = require("../../../server/models/Play");
const playParser = require("../playParseing");
var teams = require("../teams").nba_teams;
teams = Object.values(teams);
teams = teams.filter((team, index) => teams.indexOf(team) === index);
const db = require("../../../server/config/connection");
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async () => {
  try {
    const arr = [];
    // get position of lal
    for (var i = 0; i < teams.length; i++) {
      const team = teams[i];
      const Plays = require(`C:/Users/evanh/OneDrive/Desktop/BasketBallOdds/dbs/Plays/${team}.json`);
      const boxScores = require(`C:/Users/evanh/OneDrive/Desktop/BasketBallOdds/dbs/BoxScores/${team}.json`);
      const gameIds = Object.keys(Plays);
      for (var j = 0; j < gameIds.length; j++) {
        const gameId = gameIds[j];
        const fullBoxScore = boxScores[gameId];
        const teams = Object.keys(fullBoxScore);
        const team1 = team;
        const team2 = teams.filter((team) => team !== team1)[0];
        const boxScore = fullBoxScore[team1];
        const vsBoxScore = fullBoxScore[team2];
        const playsList = Plays[gameId]["allPlays"];
        for (var k = 0; k < playsList.length; k++) {
          const play = playsList[k];
          if (play.teamPlay !== team) continue;
          // console.log(play);
          const playTmpArr = await playParser({
            play,
            roster1: boxScore,
            roster2: vsBoxScore,
            gameId,
            team1,
            team2,
          });
          for (const playTmp of playTmpArr) {
            if (!playTmp.type || !playTmp.playerId) {
              console.log(playTmp);
              process.exit();
              playTmp.playerId = "Unknown";
            }

            playTmp.shotType = play.shotType;
            arr.push(playTmp);
          }
          // console.log(arr)
        }
        // console.log(arr);
      }
    }
    // process.exit();
    console.log(arr);
    await Play.insertMany(arr);
    console.log("Success!");
  } catch (error) {
    console.error("Error inserting documents:", error);
  } finally {
    // Close the connection after the operation is done
    db.close();
    console.log("Disconnected from MongoDB");
  }
});
