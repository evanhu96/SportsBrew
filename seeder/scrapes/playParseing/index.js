const Play = require("../../../server/models/Play");
const parseText = require("./helpers/parseText");
const calculateSecondsIntoGame = require("./helpers/calculateSecondsIntoGame");
const main = async ({ play, team1, team2, roster1, roster2, gameId }) => {
  const parsedPlays = await parseText({
    play: play.playText,
    team1,
    team2,
    roster1,
    roster2,
  });

  const newPlays = [];
  const secondsIntoGame = calculateSecondsIntoGame({
    minute: play.minute,
    second: play.second,
    quarter: play.quarter,
  });
  for (const parsedPlay of parsedPlays) {
    const newPlay = new Play({
      ...parsedPlay,
      gameId,
      secondsIntoGame,
      awayScore: play.awayScore,
      homeScore: play.homeScore,
      minute: play.minute,
      second: play.second,
      quarter: play.quarter,
      team: play.teamPlay,
      text: play.playText,
      time: play.time,
    });
    newPlays.push(newPlay);
  }

  return newPlays;
};
module.exports = main;
