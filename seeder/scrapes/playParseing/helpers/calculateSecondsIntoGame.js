
const main = ({ minute, second,quarter }) => {
  const secondsIntoQuarter = (11 - minute) * 60 + (60 - second);
  const quartersIntoSeconds = (parseInt(quarter) - 1) * 720;
  const secondsIn = secondsIntoQuarter + quartersIntoSeconds;
  return secondsIn;
};
module.exports = main;
