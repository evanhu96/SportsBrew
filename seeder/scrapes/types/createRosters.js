const axios = require("axios");
const cheerio = require("cheerio");
const RosterSpot = require("../../../server/models/RosterSpot");
//paths
const containerPath = `#fittPageContainer > div:nth-child(2) > div:nth-child(5) > div > div:nth-child(1) > section > div > section > div:nth-child(2) > div > div:nth-child(2) > div > div:nth-child(2) > table > tbody
`;
const getRoster = async (team) => {
  console.log("Scraping:", team);
  // clear rosterspot

  // await delay(1000);

  const url = "https://www.espn.com/nba/team/roster/_/name/" + team;
  const roster = {};
  try {
    const response = await axios(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const table = $(containerPath);
    const trs = table.find("tr");
    for (const tr of trs) {
      // get second td text
      const td = $(tr).find("td").eq(1);
      // get a inside of td
      const a = td.find("a");
      const name = a.text();
      const span = td.find("span");
      const number = span.text();
      // get href
      const href = a.attr("href");
      // get id
      const id = href.split("id/")[1].split("/")[0];
      roster[id] = { name, number };
      // create RosterSpot
      const rosterSpot = new RosterSpot({
        team,
        playerId: id,
      });
      await rosterSpot.save();
    }
    return roster; // Return your obj or data
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
// testy

module.exports = getRoster;
