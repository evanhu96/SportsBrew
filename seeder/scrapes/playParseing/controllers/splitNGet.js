const getPlayer = require("../helpers/getPlayer");
const main = async ({ play, splitBy, arrIdx, roster, type }) => {
  const obj = { type };
  const player = play.split(splitBy)[arrIdx].trim();

  const playerObj = await getPlayer({
    playerFullName: player,
    roster: roster,
  });
  if (playerObj === null) return null;
  obj.playerId = playerObj.id;
  if (playerObj == 0) obj.playerId = "coach";
  return obj;
};
module.exports = main;
