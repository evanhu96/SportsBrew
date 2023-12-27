const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const prompt = require("prompt-sync")();
const nameScrape = async (searchObject) => {
  var { id, url } = searchObject;
  console.log(url, "url");
  // wait 10 seconds before scraping
  return new Promise((resolve, reject) => {
    axios(url)
      .then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        const playerInfo = { id };
        const labelsToExtract = [
          "Age",
          "College",
          "Draft Info",
          "Birthdate",
          "HT/WT",
        ];

        // Loop through each label and extract data
        labelsToExtract.forEach((label) => {
          const $labelDiv = $(`li div:contains("${label}")`);
          if ($labelDiv.length) {
            const labelValue = $labelDiv.next("div").text().trim();
            playerInfo[label.toLowerCase()] = labelValue;
          }
        });
        playerInfo.firstName = $("span.truncate:nth-child(1)").text();
        playerInfo.lastName = $("span.truncate:nth-child(2)").text();

        playerInfo.age = $(
          ".PlayerHeader__Bio_List > li:nth-child(2) > div:nth-child(2) > div:nth-child(1)"
        ).text();
        playerInfo.college = $(
          ".PlayerHeader__Bio_List > li:nth-child(2) > div:nth-child(2) > div:nth-child(1)"
        ).text();
        resolve(playerInfo);
      })
      .catch(async (err) => {
        resolve(null)
      });
  });
};
const main = async ({ roster, playerFullName } ) => {
  console.log( playerFullName)
  const finderFirstInitial = playerFullName[0];
  const finderLastName = playerFullName.split(" ")[1].trim();
  const players = Object.keys(roster);
  const idToName = {};
  // console.log(roster)
  // console.log(console.log(finderFirstInitial, finderLastName))
  for (const id of players) {
    if (id === "team") continue;
    // console.log(id, "id", roster)
    const player = roster[id].name;
    const firstInitial = player[0];
    const lastName = player.split(" ")[1].trim();
    if (firstInitial !== finderFirstInitial || lastName !== finderLastName) {
      continue;
    }
    idToName[id] = player;
  }
  const id = Object.keys(idToName)[0];
  const url = `https://www.espn.com/nba/player/_/id/${id}`;
  const newPLayer = await nameScrape({ url, id });
  if (newPLayer === null) return null;
  const playerDB = require("C:/Users/evanh/OneDrive/Desktop/BasketBallOdds/dbs/Players/playersFull.json");
  playerDB[id] = newPLayer;
  fs.writeFileSync("C:/Users/evanh/OneDrive/Desktop/BasketBallOdds/dbs/Players/playersFull.json", JSON.stringify(playerDB));
  // take a ten second break
  await new Promise((resolve) => setTimeout(resolve, 10000));
  return newPLayer;
};
module.exports = main;
