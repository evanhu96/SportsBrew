const splitNGet = require("../controllers/splitNGet.js");
const main = async ({ play, roster }) => {
  const plays = [];
  var makeObj;
  if (play.split(" ")[0] === "makes")
    makeObj = { playerId: "unknown", type: "make" };
  else
    makeObj = await splitNGet({
      play,
      splitBy: "makes",
      arrIdx: 0,
      roster: roster,
      type: "make",
    });
  if (play.includes("three point")) makeObj.value = 3;
  else if (play.includes("free throw")) makeObj.value = 1;
  else makeObj.value = 2;
  var shotType = play.split("makes")[1];
  plays.push(makeObj);
  if (play.includes("assist")) {
    const assistObj = await splitNGet({
      play: play.split("assist")[0],
      splitBy: "(",
      arrIdx: 1,
      roster: roster,
      type: "assist",
    });

    plays.push(assistObj);
    shotType = shotType.split("(")[0];
  }
  if (shotType.includes("foot")) {
    makeObj.ft = parseInt(shotType.split("-foot")[0].trim());
    shotType = shotType.split("-foot")[1];
  }
  makeObj.shotType = shotType.trim();
  return plays;
};
module.exports = main;
