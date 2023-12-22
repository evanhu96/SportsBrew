const splitNGet = require("../controllers/splitNGet.js");
const main = async ({ play, roster1, roster2 }) => {
  const arr = [];
  var blockObj = {};
  var blockedObj = {};
  blockObj = await splitNGet({
    play,
    splitBy: "blocks",
    arrIdx: 0,
    roster: roster2,
    type: "block",
  });

  blockedObj = await splitNGet({
    play: play.split("'s ")[0],
    splitBy: "blocks",
    arrIdx: 1,
    roster: roster1,
    type: "blocked",
  });
  if (blockObj === null || blockedObj === null) {
    blockObj = await splitNGet({
      play,
      splitBy: "blocks",
      arrIdx: 0,
      roster: roster1,
      type: "block",
    });

    blockedObj = await splitNGet({
      play: play.split("'s ")[0],
      splitBy: "blocks",
      arrIdx: 1,
      roster: roster2,
      type: "blocked",
    });
  }
  arr.push(blockObj);
  arr.push(blockedObj);

  return arr;
};
module.exports = main;
