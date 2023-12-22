const splitNGet = require("../controllers/splitNGet.js");
const main = async ({ play, roster }) => {
  const arr = [];
  //
  const subInObj = await splitNGet({
    play,
    splitBy: "enters the game for",
    arrIdx: 0,
    roster: roster,
    type: "subIn",
  });
  arr.push(subInObj);
  const subOutObj = await splitNGet({
    play,
    splitBy: "enters the game for",
    arrIdx: 1,
    roster: roster,
    type: "subOut",
  });
  // check if empty string after enter game

  if (!subOutObj.playerId && play.split("enters the game for")[1].length < 2)
    subOutObj.playerId = 'unknown'
  arr.push(subOutObj);
  return arr;
};
module.exports = main;
