const Play = require("../../server/models/Play");
const Game = require("../../server/models/Game");
const db = require("../../server/config/connection");
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async () => {
  // find all play duplicates defined as same gameId and same playerId
  console.log("here");
  const plays = await Play.find({}).lean();
  console.log(plays.length);
  const playDupes = [];
  const playObj = {};
  for (var i = 0; i < plays.length; i++) {
    const play = plays[i];
    if (!playObj[play.gameId]) playObj[play.gameId] = 1;
    else playObj[play.gameId] += 1;
    if (i % 1000 === 0) console.log(i, plays.length);
  }
  //   log by most duplicates
  const games = Object.keys(playObj);
  for (const game of games) {
    const count = playObj[game];
    playDupes.push({ gameId: game, count });
    
  }
    playDupes.sort((a, b) => b.count - a.count);
    console.log(playDupes);
});
