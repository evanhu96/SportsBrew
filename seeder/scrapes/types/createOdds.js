const fs = require("fs");
const { Odds, GameToday } = require("../../../server/models");
const teams = require("../teams");
const containerPath = ".sportsbook-table__body";
const { Builder, By } = require("selenium-webdriver");
const firefox = require("selenium-webdriver/firefox");

const driver_helper = async (url) => {
    try{
  
      const driver = await new Builder().forBrowser("firefox").build();
      driver.manage().window().maximize();
      console.log("url", url);
      // Navigate to the page
      await driver.get(url);
      return driver;
    } catch (err) {
      console.log(err);
    }
    
  };
function convertAmericanOddsToPercent(americanOdds) {
  // Get and remover first character from the string
  const sign = americanOdds.charAt(0);
  americanOdds = americanOdds.slice(1);
  // Extracting the numeric value from the string
  const oddsValue = parseInt(americanOdds);

  if (sign === "+") {
    return (100 / (oddsValue + 100)) * 100;
  } else {
    return (-(-oddsValue) / (-(-oddsValue) + 100)) * 100;
  }
}
async function getOdds(url, prop,away,home) {
  console.log("Scraping:", url);
  // Set up Firefox options
  const options = new firefox.Options();
  options.headless(); // Set to true for headless browsing

  // Launch Firefox browser
  const driver = await new Builder()
    .forBrowser("firefox")
    .setFirefoxOptions(options)
    .build();

  try {
    // Navigate to the URL
    await driver.get(url);

    // Find the first table
    const firstTable = await driver.findElement(By.css("table"));

    // Find the first tbody within the table
    const firstTbody = await firstTable.findElement(By.css("tbody"));

    // Find all tr elements within the tbody
    const rows = await firstTbody.findElements(By.css("tr"));
    const objects = [];
    for (const row of rows) {
      // Find th and td elements within each row
      const thElement = await row.findElement(By.css("th"));
      const tdElements = await row.findElements(By.css("td"));

      // Get text from th and td elements
      var name = await thElement.getText();
      const over = (await tdElements[0].getText()).split("\n");
      const under = (await tdElements[1].getText()).split("\n");
      if (name.includes("New")) {
        name = name.split("New")[0].trim();
      }
      const overPercent = convertAmericanOddsToPercent(over[2]);
      const underPercent = convertAmericanOddsToPercent(under[2]);
 
      objects.push({
        name: name,
        away,
        home,
        overAmt: parseFloat(over[1]),
        underAmt: parseFloat(under[1]),
        overOdds: over[2],
        underOdds: under[2],
        overPercent: parseFloat(overPercent.toFixed(2)),
        underPercent: parseFloat(underPercent.toFixed(2)),
        prop
      });
    }
    return objects;
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Close the browser
    await driver.quit();
  }
}
const getGameElements = async (driver) => {
  const container = await driver.findElement(By.css(containerPath));
  // await logContainerChildrenDetails(container);
  const trs = await container.findElements(By.css("tr"));
  const gameElements = [];
  for (var i = 0; i < trs.length; i++) {
    const tr = trs[i];
    const aLink = await tr.findElement(By.css("a"));
    const href = await aLink.getAttribute("href");
    // find span element by inner tedt
    var over, under, total;
    try {
      const overElement = await tr.findElement(By.xpath(".//span[text()='O']"));
      const totalElement = await overElement.findElement(
        By.xpath("./parent::*/*[3]")
      );

      const overOddsElement = await overElement.findElement(
        By.xpath("./parent::*/parent::*/*[2]")
      );
      over = await overOddsElement.getText();
      total = await totalElement.getText();
    } catch (err) {
      // console.log(await tr.getText());
      var underElement;
      try {
        underElement = await tr.findElement(By.xpath(".//span[text()='U']"));
      } catch {
        continue;
      }
      const underOddsElement = await underElement.findElement(
        By.xpath("./parent::*/parent::*/*[2]")
      );
      under = await underOddsElement.getText();
    }
    const versus = href.split("event/")[1].split("/")[0];
    const away = teams[versus.split("-%40-")[0]];
    const home = teams[versus.split("-%40-")[1]];
    if (under) {
      over = over.replace("−", "-");
      under = under.replace("−", "-");
      gameElements.push({ home, away, url: href });
      over = null;
      under = null;
      total = null;
    }
  }
  await GameToday.deleteMany({});
  await GameToday.insertMany(gameElements);
  return gameElements;
};

const main = async () => {
  const url = "https://sportsbook.draftkings.com/leagues/basketball/nba";
  const driver = await driver_helper(url);
  const gameElements = await getGameElements(driver);
  // remove duplicates
  const gameObjects = [...new Set(gameElements)];
  // write json file with gamesWithTotalData

  driver.quit();

  const games = [];
  for (var i = 0; i < gameObjects.length; i++) {
    const game = gameObjects[i];
    const home = game.home;
    const away = game.away;
    const pointsUrl = game.url + "?category=odds&subcategory=player-points";
    const reboundsUrl = game.url + "?category=odds&subcategory=player-rebounds";
    const assistsUrl = game.url + "?category=odds&subcategory=player-assists";
    var gamePoints, gameRebounds, gameAssists, gameData;

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      gamePoints = await getOdds(pointsUrl, "point", away, home);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      gameRebounds = await getOdds(reboundsUrl, "rebound", away, home);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      gameAssists = await getOdds(assistsUrl, "assist", away, home);
      gameData = [...gamePoints, ...gameRebounds, ...gameAssists];
    } catch (err) {
      continue;
    }
    games.push(...gameData);
  }
  await Odds.deleteMany({});
  await Odds.insertMany(gameData);


  return
};
module.exports = main;
