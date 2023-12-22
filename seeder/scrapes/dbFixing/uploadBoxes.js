const MongoClient = require("mongodb").MongoClient;
const fs = require("fs");
const BoxScore = require("../../models/BoxScore");
// remove duplicate objects using gameId prop
function transformToBoxScore(originalObject) {
  const transformedObject = {
    name: originalObject.name
      ? originalObject.name.trim()
      : originalObject.team,
    position: originalObject.position ? originalObject.position.trim() : "team",
    starter: originalObject.starter,
    playerId: originalObject.playerId,
    MIN: originalObject.MIN ? parseInt(originalObject.MIN) : 0,
    FGA: parseInt(originalObject.FG.split("-")[1]),
    FGM: parseInt(originalObject.FG.split("-")[0]),
    "3PTA": parseInt(originalObject["3PT"].split("-")[1]),
    "3PTM": parseInt(originalObject["3PT"].split("-")[0]),
    FTA: parseInt(originalObject.FT.split("-")[1]),
    FTM: parseInt(originalObject.FT.split("-")[0]),
    OREB: parseInt(originalObject.OREB),
    DREB: parseInt(originalObject.DREB),
    REB: parseInt(originalObject.REB),
    AST: parseInt(originalObject.AST),
    STL: parseInt(originalObject.STL),
    BLK: parseInt(originalObject.BLK),
    TO: parseInt(originalObject.TO),
    PF: parseInt(originalObject.PF),
    "+/-":originalObject["+/-"] ? parseFloat(originalObject["+/-"]):0,
    PTS: parseInt(originalObject.PTS),
  };

  return transformedObject;
}
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
      const BoxScores = require(`C:/Users/evanh/OneDrive/Desktop/BasketBallOdds/dbs/BoxScores/${team}.json`);
      const boxScoreIds = Object.keys(BoxScores);
      for (var j = 0; j < boxScoreIds.length; j++) {
        const boxScoreId = boxScoreIds[j];
        const boxScoreTmp = BoxScores[boxScoreId][team];
        const players = Object.keys(boxScoreTmp);
        for (var k = 0; k < players.length; k++) {
          const player = players[k];
          const playerTmp = boxScoreTmp[player];
          var playerObj = {};
          playerTmp.team = team;
          playerTmp.gameId = boxScoreId;
          playerTmp.playerId = player;
          if (player !== "team")
            if (playerTmp.MIN.includes("DNP"))
              playerObj = { ...playerTmp, MIN: 0 };
            else playerObj = transformToBoxScore(playerTmp);
          else playerObj = transformToBoxScore(playerTmp);
          playerObj.gameId = boxScoreId;
          playerObj.team = team;
          playerObj.playerId = player;
          arr.push(playerObj);
        }
      }
    }
    for (var i = 0; i < arr.length; i++) {
      // console.log(arr[i]);
      // await BoxScore.create(arr[i]);
    } // insert documents into the database
    await BoxScore.insertMany(arr);
    console.log("Success!");
  } catch (error) {
    console.error("Error inserting documents:", error);
  } finally {
    // Close the connection after the operation is done
    db.close();
    console.log("Disconnected from MongoDB");
  }
});
