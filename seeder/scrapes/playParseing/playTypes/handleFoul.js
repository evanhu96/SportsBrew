const splitNGet = require("../controllers/splitNGet.js");

const main = async ({ play, roster1, roster2 }) => {
  var foulType;
  if (play.includes("shooting")) foulType = "shooting";
  else if (play.includes("offensive")) foulType = "offensive";
  else if (play.includes("flopping technical foul")) foulType = "flopping technical foul";
  else if (play.includes("double personal")) foulType = "double personal";
  else if (play.includes("personal")) foulType = "personal";
  else if (play.includes("loose ball")) foulType = "loose ball";
  else if (play.includes("away from play")) foulType = "away from play";
  else if (play.includes("Double technical"))
    return [{ text: play, playerId: "Double technical", type: "foul" }];
  else if (play.includes("defensive 3-seconds"))
  foulType = "defensive 3-seconds";
else if (play.includes("personal take")) foulType = "personal take";
else if (play.includes("transition take")) foulType = "transition take";
else if (play.includes("technical")) foulType = "technical";
  else if (play.includes("flagrant foul type 1"))
    foulType = "flagrant foul type 1";
  else if (play.includes("flagrant foul type 2"))
    foulType = "flagrant foul type 2";
  else if (play.includes("clear path")) foulType = "clear path";
  else if (play.includes("delay techfoul")) foulType = "delay techfoul";
  else if (play.includes("hanging techfoul")) foulType = "hanging techfoul";
  if (foulType !== "Double technical foul:") {
    const foulObj = await splitNGet({
      play,
      splitBy: foulType,
      arrIdx: 0,
      roster: roster1,
      type: "foul",
    });
    foulObj.foulType = foulType;
    return [foulObj];
  } else {
    play = play.split("foul:")[1];
    foulType = "technical foul";
    var foulObj1;
    var foulObj2;
    try {
      foulObj1 = await splitNGet({
        play,
        splitBy: " and ",
        arrIdx: 0,
        roster: roster1,
        type: "foul",
      });
      foulObj2 = await splitNGet({
        play,
        splitBy: " and ",
        arrIdx: 1,
        roster: roster2,
        type: "foul",
      });
    } catch {
      foulObj1 = await splitNGet({
        play,
        splitBy: " and ",
        arrIdx: 0,
        roster: roster2,
        type: "foul",
      });
      foulObj2 = await splitNGet({
        play,
        splitBy: " and ",
        arrIdx: 1,
        roster: roster1,
        type: "foul",
      });
    }
    foulObj1.foulType = foulType;
    foulObj2.foulType = foulType;
    return [foulObj1, foulObj2];
  }
};

module.exports = main;
