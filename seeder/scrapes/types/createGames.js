const axios = require("axios");
const moment = require("moment");
const cheerio = require("cheerio");
const Game = require("../../../server/models/Game");
const TeamGame = require("../../../server/models/TeamGame");
const fixTeams = require("../playParseing/helpers/fixTeams");
//paths
const translatedSelector = (xpath) => {
  return xpath
    .split("/")
    .filter((part) => part) // Remove empty parts
    .map((part) => {
      if (part.includes("[")) {
        const tagName = part.split("[")[0];
        const index = part.match(/\[(\d+)\]/)[1];
        return `${tagName}:nth-child(${index})`;
      } else {
        return part;
      }
    })
    .join(">");
};

const awayTeamPath = translatedSelector(
  "#themeProvider/div/div/div[1]/div/div[2]/div[2]/div[2]/div/div/div[2]/table/tbody/tr[1]/td[1]"
);
const homeTeamPath = translatedSelector(
  "#themeProvider/div/div/div[1]/div/div[2]/div[2]/div[2]/div/div/div[2]/table/tbody/tr[2]/td[1]"
);
// get length of this elements td children
var awayQuartersPath = translatedSelector(
  "#themeProvider/div/div/div[1]/div/div[2]/div[2]/div[2]/div/div/div[2]/table/tbody/tr[1]"
);
var homeQuartersPath = translatedSelector(
  "#themeProvider/div/div/div[1]/div/div[2]/div[2]/div[2]/div/div/div[2]/table/tbody/tr[2]"
);

const homeRecordsPath = translatedSelector(
  "#themeProvider/div/div/div[1]/div/div[2]/div[1]/div[2]/div[1]/div[1]/div[2]"
);
const awayRecordsPath = translatedSelector(
  "#themeProvider/div/div/div[1]/div/div[2]/div[3]/div[2]/div[1]/div[1]/div[2]"
);
const otherAwayRecordsPath = translatedSelector(
  `   
    #themeProvider/div/div/div[1]/div/div/div[1]/div[2]/div[1]/div[1]/div[2]
  `
);
const otherHomeRecordsPath = translatedSelector(
  `
    #themeProvider/div/div/div[1]/div/div/div[3]/div[2]/div[1]/div[1]/div[2]
  `
);
const otherAwayTeamPath = translatedSelector(
  `
    #themeProvider/div/div/div[1]/div/div/div[2]/div[2]/div/div/div[2]/table/tbody/tr[1]/td[1]
  
  `
);
const otherHomeTeamPath = translatedSelector(
  `
    #themeProvider/div/div/div[1]/div/div/div[2]/div[2]/div/div/div[2]/table/tbody/tr[2]/td[1]
  
  `
);
const otherAwayQuartersPath = translatedSelector(
  `
    #themeProvider/div/div/div[1]/div/div/div[2]/div[2]/div/div/div[2]/table/tbody/tr[1]
        `
);
const otherHomeQuartersPath = translatedSelector(
  `
  #themeProvider/div/div/div[1]/div/div/div[2]/div[2]/div/div/div[2]/table/tbody/tr[2]
  `
);

// finsihed
const datePath = translatedSelector(
  "#themeProvider/div/div/div[6]/div/div[1]/section[3]/div/div[1]/div[1]/div[2]/span[1]"
);

const attendancePath = translatedSelector(" .Attendance__Numbers");
const otherAttendancePath = translatedSelector(
  `
  .Attendance__Numbers
  
  `
);
const refereesPath = translatedSelector(
  "#themeProvider/div/div/div[6]/div/div[1]/section[3]/div/div[2]/ul"
);
const teamName = async (city) => {
  var realTeamName = city;
  console.log(city);
  if (city === "NJ") realTeamName = "BKN";
  if (city === "SEA") realTeamName = "OKC";
  if (city === "NY") realTeamName = "NYK";
  if (city === "SA") realTeamName = "SAS";
  if (city === "PHO") realTeamName = "PHX";
  return realTeamName;
};
const getGameData = async ({ gameId, year }) => {
  // check if data already exists
  console.log(gameId, "kiojoiuho");
  const url = "https://www.espn.com/nba/game?gameId=" + gameId;
  try {
    const response = await axios(url);
    const html = response.data;
    const $ = cheerio.load(html);
    var awayTeam = await teamName($(awayTeamPath).text());
    var homeTeam = await teamName($(homeTeamPath).text());
    console.log(awayTeam, homeTeam, "ounoub");
    const date = $(datePath).text();
    // turn date string into epoch

    var attendance = $(attendancePath).text();
    const refereeElements = $(refereesPath).children();
    const referees = [];
    for (var i = 2; i <= refereeElements.length; i++) {
      const referee = $(refereesPath).children(`li:nth-child(${i})`).text();
      referees.push(referee);
    }
    var awayRecords = $(homeRecordsPath).text();
    if (!awayRecords) {
      awayTeam = await teamName($(otherAwayTeamPath).text());
      homeTeam = await teamName($(otherHomeTeamPath).text());
      attendance = $(otherAttendancePath).text();
      homeQuartersPath = otherHomeQuartersPath;
      awayQuartersPath = otherAwayQuartersPath;
    }
    const away = awayRecords ? fixTeams(awayRecords.trim()) : awayTeam;
    const home = awayRecords
      ? fixTeams($(homeRecordsPath).text().trim())
      : homeTeam;
    var awayQuarters = $(awayQuartersPath).children();
    var homeQuarters = $(homeQuartersPath).children();
    var attendanceInt;
    try {
      attendanceInt = parseInt(attendance.split(":")[1].split(",").join(""));
    } catch (err) {
      console.log(gameId);
    }

    const quartersObj = { away: {}, home: {} };
    const totalsObj = {};
    for (var i = 2; i <= awayQuarters.length; i++) {
      const homeQuarter = parseInt(
        $(homeQuartersPath).children(`td:nth-child(${i})`).text()
      );
      const awayQuarter = parseInt(
        $(awayQuartersPath).children(`td:nth-child(${i})`).text()
      );
      if (i == homeQuarters.length) {
        quartersObj["away"][`final`] = awayQuarter;
        quartersObj["home"][`final`] = homeQuarter;
      } else {
        quartersObj["away"][`${i - 1}`] = awayQuarter;
        quartersObj["home"][`${i - 1}`] = homeQuarter;
        totalsObj[`${i - 1}`] = awayQuarter + homeQuarter;
      }
    }
    const parsedDate = moment(date, "h:mm A, MMMM D, YYYY");
    // check for win
    const homeScore = parseInt(quartersObj["home"].final);
    const awayScore = parseInt(quartersObj["away"].final);

    const dateEpoch = new Date(date).getTime();
    const militaryTime = parsedDate.format("HHmm");

    const winner = homeScore > awayScore ? home : away;
    const loser = homeScore > awayScore ? away : home;
    const total = homeScore + awayScore;

    const OT = homeQuarters.length > 6 ? true : false;
    const game = new Game({
      gameId,
      dateEpoch,
      militaryTime,
      year,
      home: home,
      away: away,
      winner,
      loser,
      seasonType: "Regular Season",
      refs: referees,
      total,
      totalByQuarter: totalsObj,
      attendance: attendanceInt,
      OT,
    });
    try {
      await Game.create(game);
      console.log(gameId, "game created");
    } catch (err) {
      console.log(err);
    }

    const awayTeamGame = new TeamGame({
      gameId,
      team: away,
      score: awayScore,
      vsScore: homeScore,
      scoreByQuarter: quartersObj["away"],
      vsScoreByQuarter: quartersObj["home"],
    });
    const homeTeamGame = new TeamGame({
      gameId,
      team: home,
      score: homeScore,
      vsScore: awayScore,
      scoreByQuarter: quartersObj["home"],
      vsScoreByQuarter: quartersObj["away"],
    });
    try {
      await TeamGame.create(awayTeamGame);
      console.log(gameId, "away team game created");
    } catch (err) {
      console.log(err);
    }
    try {
      await TeamGame.create(homeTeamGame);
      console.log(gameId, "home team game created");
    } catch (err) {
      console.log(err);
    }
    return { home: homeTeam, away: awayTeam }; // Return your obj or data
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
// testy

module.exports = getGameData;
