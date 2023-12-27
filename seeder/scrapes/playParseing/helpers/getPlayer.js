const prompt = require("prompt-sync")();
const coaches = require("C:/Users/evanh/OneDrive/Desktop/BasketBallOdds/dbs/Players/coaches.js");
const gameObject = {};
const playersDB = require("C:/Users/evanh/OneDrive/Desktop/BasketBallOdds/dbs/Players/playersFull.json");
const addPlayer = require("./addPlayer");
const getPlayer = async ({ playerFullName, roster }) => {
  const ids = [];
  console.log(roster, "roster");
  console.log(playerFullName);
  const players = Object.keys(roster);
  for (const player of players) ids.push(player.id);
  playerFullName = playerFullName.trim();
  if (
    playerFullName == "" ||
    playerFullName.includes("vs.") ||
    playerFullName == "8 second" ||
    playerFullName == "Team"
  ) {
    return 0;
  }
  if (playerFullName == "Jeenathan Williams") playerFullName = "Nate Williams";
  if (playerFullName == "Jermaine Samuels")
    playerFullName = "Jermaine Samuels Jr.";
  if (playerFullName == "Kenyon Martin Jr.") playerFullName = "KJ Martin";
  if (playerFullName == "Xavier Tillman Sr.") playerFullName = "Xavier Tillman";
  if (playerFullName == "Patrick Baldwin Jr.")
    playerFullName = "Patrick Baldwin";
  if (playerFullName == "Reggie Bullock") playerFullName = "Reggie Bullock Jr.";
  if (playerFullName == "Brandon Boston") playerFullName = "Brandon Boston Jr.";
  if (playerFullName == "OG Anunoby") playerFullName = "O.G. Anunoby";
  if (playerFullName == "Kenny Lofton Jr.")
    playerFullName = "Kenneth Lofton Jr.";
  if (playerFullName == "P.J. Dozier") playerFullName = "PJ Dozier";
  if (playerFullName == "Julius Randle's") playerFullName = "Julius Randle";
  if (playerFullName == "A.J. Green") playerFullName = "AJ Green";
  if (playerFullName == "Justise Winslow") playerFullName = "Justice Winslow";
  if (playerFullName == "Jeff Dowtin Jr.") playerFullName = "Jeff Dowtin";
  if (playerFullName == "Nikola Jovic") playerFullName = "Nikola Jović";

  // const playerId = roster[playerFullName].id;
  const matchingPlayers = [];

  // find players in players with first initial and last name

  for (const playerId of players) {
    if (playerId === "team") continue;

    var player = playersDB[playerId];
    if (!player)
      player = await addPlayer({ playerFullName: roster[playerId].name, roster });
    console.log(player, "player");
    const fullName = player.firstName + " " + player.lastName;
    if (fullName == playerFullName) {
      matchingPlayers.push(player);
    }
  }
  if (matchingPlayers.length > 1) {
    console.log(matchingPlayers);

    prompt("multiple players found");
  }
  var player;
  if (matchingPlayers.length === 1) {
    player = matchingPlayers[0];
  } else {
    const possibleIds = matchingPlayers.map((player) => {
      return player.id;
    });
    // find all players in ids that are in possibleIds
    const matchingIds = ids.filter((id) => {
      return possibleIds.includes(id);
    });
    if (matchingIds.length === 1) {
      player = matchingPlayers.find((player) => {
        return player.id === matchingIds[0];
      });
    } else {
      if (coaches.includes(playerFullName)) {
        return 0;
      }
      player = await addPlayer({ playerFullName, roster });
      console.log(player, "player");
      if (player === null) return null;
      console.log("no player found", playerFullName);
    }
  }
  const id = player.id;
  const keys = Object.keys(gameObject);
  if (!keys.includes(id)) {
    gameObject[id] = {};
  }
  return { ...player, id, fullName: playerFullName };
};

module.exports = getPlayer;
