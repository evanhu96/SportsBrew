const splitNGet = require("../controllers/splitNGet");

const main = async ({ play, roster1, roster2, team1 }) => {
  const arr = [];
  var turnoverType;
  if (play.split(" second turnover").join().length == 2)
    return [{ turnoverType: play, type: "turnover", playerId: team1 }];
  if (play.includes("turnover (lane violation)"))
    turnoverType = "turnover (lane violation)";
  else if (play.includes("lane violation")) turnoverType = "lane violation";
  else if (play.includes("traveling")) turnoverType = "traveling";
  else if (play.includes("basket from below"))
    turnoverType = "basket from below";
  else if (play.includes("out of bounds bad pass"))
    turnoverType = "out of bounds bad pass";
  else if (play.includes("out of bounds lost ball"))
    turnoverType = "out of bounds lost ball";
  else if (play.includes("bad pass turnover"))
    turnoverType = "bad pass turnover";
  else if (play.includes("lost ball")) turnoverType = "lost ball";
  else if (play.includes("disc dribble")) turnoverType = "disc dribble";
  else if (play.includes("double dribble")) turnoverType = "double dribble";
  else if (play.includes("kicked ball")) turnoverType = "kicked ball";
  else if (play.includes("steps out of bounds"))
    turnoverType = "steps out of bounds";
  else if (play.includes("out of bounds")) turnoverType = "out of bounds";
  else if (play.includes("shot clock"))
    return [{ turnoverType: "shot clock", type: "turnover", playerId: team1 }];
  else if (play.includes("offensive goaltending"))
    turnoverType = "offensive goaltending";
  else if (play.includes("palming")) turnoverType = "palming";
  else if (play.includes("3 second")) turnoverType = "3 second";
  else if (play.includes("5 sec")) turnoverType = "5 sec";
  else if (play.includes("back court")) turnoverType = "back court";
  else if (play.includes("illegal assist")) turnoverType = "illegal assist";
  else if (play.includes("inbound")) turnoverType = "inbound";
  else if (play.includes("jumpball violation"))
    turnoverType = "jumpball violation";
  else if (play.includes("discontinue dribble"))
    turnoverType = "discontinue dribble";
  else if (play.includes("punched ball")) turnoverType = "punched ball";
  else if (play.includes("excess timeout"))
    return [
      { turnoverType: "excess timeout", type: "turnover", playerId: team1 },
    ];
  // check if turnover is the last word
  else if (play.trim() === "turnover")
    return [{ turnoverType: "turnover", type: "turnover", playerId: team1 }];
  else if (play.split(" ")[play.split(" ").length - 1] === "turnover")
    turnoverType = "turnover";
  console.log(roster1)
  const turnoverObj = await splitNGet({
    play,
    splitBy: turnoverType,
    arrIdx: 0,
    roster: roster1,
    type: "turnover",
  });
  turnoverObj.turnoverType = turnoverType;
  arr.push(turnoverObj);

  if (play.includes("steal")) {
    const stealObj = await splitNGet({
      play: play.split("steal")[0],
      splitBy: "(",
      arrIdx: 1,
      roster: roster2,
      type: "steal",
    });
    arr.push(stealObj);
  }
  return arr;
};

module.exports = main;
