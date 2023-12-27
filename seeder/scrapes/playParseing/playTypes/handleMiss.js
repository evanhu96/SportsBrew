const splitNGet = require("../controllers/splitNGet.js");
const main = async ({ play, roster }) => {
  const missObj = await splitNGet({
    play,
    splitBy: "misses",
    arrIdx: 0,
    roster: roster,
    type: "miss",
  });
  var shotType = play.split("misses")[1];
  if (shotType.includes("foot")) {
    missObj.ft = parseInt(shotType.split("-foot")[0].trim());
    shotType = shotType.split("-foot")[1];
  }
  missObj.shotType = shotType.trim();
  return [missObj];
};
module.exports = main;
