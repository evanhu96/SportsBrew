const {
  handleMake,
  handleMiss,
  handleRebound,
  handleBlock,
  handleTurnover,
  handleSub,
  handleTimeout,
  handleFoul
} = require("../playTypes");
const main = async ({ play, team1,  roster1, roster2 }) => {
  let plays = [];
  if (play.includes("makes"))
    plays = await handleMake({ play, roster: roster1 });
  else if (play.includes("misses"))
    plays = await handleMiss({ play, roster: roster1 });
  else if (play.includes("defensive rebound"))
    plays = await handleRebound({ play, roster: roster1, side: "defensive" });
  else if (play.includes("offensive rebound"))
    plays = await handleRebound({ play, roster: roster1, side: "offensive" });
  else if (play.includes("blocks"))
    plays = await handleBlock({ play, roster1, roster2 });
  else if (play.includes("turnover"))
    plays = await handleTurnover({ play, roster1, roster2, team1 });
  else if (play.includes("enters the game"))
    plays = await handleSub({ play, roster: roster1 });
  else if (play.includes("timeout")) plays = await handleTimeout({ play ,team1});
  else if (play.includes("foul")) plays = await handleFoul({ play, roster1, roster2 });
  else if (play.includes("vs."))
    plays = [{ text: play, playerId: "vs", type: "vs" }];
  return plays;
};
module.exports = main;
