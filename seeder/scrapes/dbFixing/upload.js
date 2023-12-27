const MongoClient = require("mongodb").MongoClient;
const fs = require("fs");
const TeamGame = require("../../models/TeamGame");
// remove duplicate objects using gameId prop
var teams = require("C:/Users/evanh/OneDrive/Desktop/BasketBallOdds/helperData/teams");
teams = Object.values(teams.nba_teams);
teams = teams.filter((team, index) => teams.indexOf(team) === index);
const db = require("../../config/connection");
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async () => {
  try {
    const arr = [];
    for (var i = 0; i < teams.length; i++) {
      const team = teams[i];
      const TeamData = require(`C:/Users/evanh/OneDrive/Desktop/BasketBallOdds/dbs/Games/${team}.json`);
      const gameIds = Object.keys(TeamData);
      // const boxScoreIds = Object.keys(BoxScores);
      // log all playershort duplicates
      for (const gameId of gameIds) {
        const teamGame = { team };
        const game = TeamData[gameId];
        teamGame.gameId = gameId;
        teamGame.score = game.score;
        teamGame.vsScore = game.vsScore;
        teamGame.scoreByQuarter = game.scoreByQuarter;  
        teamGame.vsScoreByQuarter = game.vsScoreByQuarter;
        arr.push(teamGame);
      }

      // log all duplicated players
    }
    await TeamGame.insertMany(arr);
    console.log("Success!");
  } catch (error) {
    console.error("Error inserting documents:", error);
  } finally {
    // Close the connection after the operation is done
    db.close();
    console.log("Disconnected from MongoDB");
  }
});
