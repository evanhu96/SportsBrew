const main = (team) => {
  if (team === "NY") {
    team = "NYK";
  } else if (team === "WSH") {
    team = "WAS";
  } else if (team === "SA") {
    team = "SAS";
  } else if (team === "PHO") {
    team = "PHX";
  }
  return team;
};
module.exports = main;
