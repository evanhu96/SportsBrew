const axios = require("axios");
const cheerio = require("cheerio");
const nba_teams = require("../teams").nba_teams;
const BoxScore = require("../../../server/models/BoxScore");
const getBoxScoreData = async (gameId) => {
  const url = "https://www.espn.com/nba/boxscore/_/gameId/" + gameId;

  const box = await new Promise((resolve, reject) => {
    axios(url).then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const boxScore = {};
      const finderObj = {};
      $(
        ".ResponsiveTable.ResponsiveTable--fixed-left.Boxscore.flex.flex-column"
      ).each((index, element) => {
        const headers = $(element).find("tbody").first();
        const siblingElementWTeamName = $(element).prev().text();
        const teamAbb = nba_teams[siblingElementWTeamName];
        boxScore[teamAbb] = {};

        $(headers)
          .find("tr")
          .each((i, el) => {
            const $el = $(el);
            const text = $el.text();
            const name = $el.find("a").text();
            const position = $el.find(".playerPosition").text();
            if (position) {
              const idSpot = $el.find("a").attr("href");
              if (!idSpot) return;
              const id = $el
                .find("a")
                .attr("href")
                .split("id/")[1]
                .split("/")[0];

              boxScore[teamAbb][id] = {};
              boxScore[teamAbb][id].name = name;
              boxScore[teamAbb][id].position = position;
              if (i <= 5) {
                boxScore[teamAbb][id].starter = true;
              } else {
                boxScore[teamAbb][id].starter = false;
              }
              finderObj[`${i}`] = id;
            } else if (text == "team") {
              boxScore[teamAbb]["team"] = { gameId };
              finderObj[`${i}`] = "team";
            }
          });
        const stats = $(element).find("tbody").last();
        const statObj = {};
        $(stats)
          .find("tr")
          .each((i, el) => {
            $(el)
              .find("td")
              .each((j, td) => {
                const playerId = finderObj[`${i}`];
                if (!playerId && i !== 0) return;
                const value = $(td).text();
                if (!value) return;
                if (i == 0) {
                  statObj[`${j}`] = value;
                } else {
                  // if value has % log it
                  if (value.includes("%")) return;
                  if (value == statObj[`${j}`]) return;
                  boxScore[teamAbb][playerId][statObj[`${j}`]] = value;
                }
              });
          });
      });
      resolve(boxScore);
    });
  });
  const turnBoxScoreIntoObj = (boxScore) => {
    const finalBox = {};
    const properties = Object.keys(boxScore);
    for (const property of properties) {
      if (property === "FG") {
        finalBox["FGA"] = parseInt(boxScore[property].split("-")[1]);
        finalBox["FGM"] = parseInt(boxScore[property].split("-")[0]);
      } else if (property === "3PT") {
        finalBox["3PTA"] = parseInt(boxScore[property].split("-")[1]);
        finalBox["3PTM"] = parseInt(boxScore[property].split("-")[0]);
      } else if (property === "FT") {
        finalBox["FTA"] = parseInt(boxScore[property].split("-")[1]);
        finalBox["FTM"] = parseInt(boxScore[property].split("-")[0]);
      } else if (property === "starter")
        finalBox[property] = boxScore[property];
      else if (property === "name") finalBox[property] = boxScore[property];
      else if (property === "position") finalBox[property] = boxScore[property];
      else finalBox[property] = parseFloat(boxScore[property]);
    }
    return finalBox;
  };
  const teams = Object.keys(box);
  for (const team of teams) {
    const players = Object.keys(box[team]);
    for (const player of players) {
      const playerObj = box[team][player];
      const boxScore = turnBoxScoreIntoObj(playerObj);
      boxScore["team"] = team;
      boxScore["playerId"] = player;
      boxScore["gameId"] = gameId;
      try {
        if(!boxScore["MIN"]) boxScore["MIN"] = 0;
        await BoxScore.create(boxScore);
        console.log("boxscore!", gameId);
      } catch (err) {
        console.log(boxScore);
        console.log(err);
        process.exit();
      }
    }
  }
  return box;
};

// test

module.exports = getBoxScoreData;
