var teams = require("./teams").nba_teams;
teams = Object.values(teams);
teams = teams.filter((team, index) => teams.indexOf(team) === index);
const Play = require("../../server/models/Play");
const BoxScore = require("../../server/models/BoxScore");
const Game = require("../../server/models/Game");
const FirstHit = require("../../server/models/FirstHit");
fs = require("fs");
const db = require("../../server/config/connection");
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const axios = require("axios");
const cheerio = require("cheerio");
const {
  createGames,
  createBoxScores,
  createPlays,
  createRosters,
  createRankings,
  createFirstHits,
} = require("./types");
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async () => {
  // fix team names

  // get distinct gameIds from plays boxes and games
  const gamesObj = {};
  const playIds = await Play.distinct("gameId");
  const boxIds = await BoxScore.distinct("gameId");
  const gameIds = await Game.distinct("gameId");
  const firstHitsIds = await FirstHit.distinct("gameId");
  const games = await Game.find({}).lean();

  // process.exit();
  games.forEach(
    (game) =>
      (gamesObj[game.gameId] = {
        home: game.homeTeam,
        away: game.awayTeam,
      })
  );

  const getData = async ({ year, gameId, rosters }) => {
    // get teams!!!!!!
    var home, away;
    if (gameIds.includes(gameId)) {
      const game = games.find((game) => game.gameId === gameId);
      home = game.home;
      away = game.away;
    } else {
      await delay(1000);
      const gameTeams = await createGames({ year, gameId });
      home = gameTeams.home;
      away = gameTeams.away;
    }
    console.log(gameId);
    if (!boxIds.includes(gameId)) {
      console.log("inside here");
      await delay(1000);
      await createBoxScores(gameId);
    }

    if (!playIds.includes(gameId)) {
      await delay(1000);
      await createPlays({ year, gameId, home, away, rosters });
    }
    if (!firstHitsIds.includes(gameId)) {
      await delay(1000);
      await createFirstHits(gameId);
    }
  };

  const getGameList = async (url) => {
    const response = await axios(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const games = [];
    const gameList = $("div.Table__ScrollerWrapper").find("tbody");
    const gameListLength = gameList.find("tr").length;
    for (var i = 0; i < gameListLength; i++) {
      const game = gameList.find("tr").eq(i);
      const gameLinkTD = game.find("td").eq(2);
      // continue from game to > td:nth-child(3) > span:nth-child(2) > a:nth-child(1)
      const gameLink = gameLinkTD.find("a").attr("href");
      const text = gameLinkTD.find("a").text();
      if (!gameLink || text.includes("PM" || text.includes("AM"))) continue;
      const gameId = gameLink.split("gameId/")[1];
      games.push(gameId);
    }
    return games;
  };

  const main = async () => {
    const gameIds = [];
    // const rosters = {};
    const rosters = require("./rosters.json");
    for (var i = 0; i < teams.length; i++) {
      const team = teams[i];
      // rosters[team] = await createRosters(team);
      await delay(1000);
      const url = `https://www.espn.com/nba/team/schedule/_/name/${team}/season/2024`;
      const ids = await getGameList(url);
      gameIds.push(ids);
    }
    // process.exit()

    console.log("start");
    const uniqueGameIds = [...new Set(gameIds.flat())];
    // log last ten ids
    // console.log(uniqueGameIds.slice(-10));

    for (var k = 0; k < uniqueGameIds.length; k++) {
      const gameId = uniqueGameIds[k];
      await getData({ year: 2024, gameId, rosters });
    }

  };
  await main();
  console.log("done");
  await createRankings();
});
