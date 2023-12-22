const main = async ({ play ,team1}) => {
  return [
    {
      type: "timeout",
      playerId: team1,
      timeOutType: play.split("timeout")[0].trim(),
    },
  ];
};
module.exports = main;
