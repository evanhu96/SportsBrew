const splitNGet = require("../controllers/splitNGet.js");
const main = async ({ play, roster, side }) => {
  const rebObj = await splitNGet({
    play,
    splitBy: `${side} rebound`,
    arrIdx: 0,
    roster: roster,
    type: "reb",
  });
  rebObj.side = side;
  return [rebObj];
};
module.exports = main;
