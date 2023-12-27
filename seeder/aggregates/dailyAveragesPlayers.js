const TeamGame = require("../../server/models/TeamGame");
const Player = require("../../server/models/Player");
const BoxScore = require("../../server/models/BoxScore");
const Game = require("../../server/models/Game");
// const db = require("../../server/config/connection");
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", async () => {
  const main = async () => {
    try {
      const thirtyDaysAgoEpoch =
        Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60; // Epoch of 30 days ago

      const playerAverages = await BoxScore.aggregate([
        { $match: { starter: true } }, // Filter for starters
        {
          $lookup: {
            from: "games",
            localField: "gameId",
            foreignField: "gameId",
            as: "game",
          },
        },
        { $unwind: "$game" },
        {
          $match: {
            "game.dateEpoch": { $gte: thirtyDaysAgoEpoch }, // Filter games played in the last thirty days
            "game.year": { $gte: 2024 }, // Filter for games from 2023 onwards
          },
        },
        {
          $sort:{
            "game.dateEpoch": 1
          }
        },
        {
          $group: {
            _id: "$playerId",
            games: { $push: "$$ROOT" },
          },
        },
        {
          $project: {
            _id: 0,
            playerId: "$_id",
            totalGames: { $size: "$games" },
            games: { $slice: ["$games", -50] }, // Limit to the last 10 games for each player
          },
        },

        // Project the player IDs to prepare for the lookup
        {
          $project: {
            playerId: 1,
            games: 1,
          },
        },

        // Lookup to fetch player names from the Players collection
        {
          $lookup: {
            from: "players",
            localField: "playerId",
            foreignField: "playerId",
            as: "playerDetails",
          },
        },

        // Unwind the playerDetails array
        {
          $unwind: "$playerDetails",
        },

        // Project the player name along with the existing fields
        {
          $project: {
            playerId: 1,
            games: 1,
            playerName: "$playerDetails.name",
          },
        },
      ]);

      const playerAveragesFiltered = [];
      for (const playerData of playerAverages) {
        const playerStats = {
          playerId: playerData.playerId,
          name: playerData.playerName,
          team: playerData.games[playerData.games.length - 1].team,
          type: "player",
        };

        const propertiesToAverage = [
          "MIN",
          "PTS",
          "AST",
          "DREB",
          "OREB",
          "REB",
          "FGA",
          "FGM",
          "3PTA",
          "3PTM",
          "FTA",
          "FTM",
          "+/-",
          "BLK",
          "TO",
          "PF",
          "STL",
        ];

        for (const property of propertiesToAverage) {
          playerStats[property] = {};
          const propertyValues = playerData.games.map((game) => game[property]);

          // Get the last 10 values or all available values if less than 10
          const lastTenPropertyValues = propertyValues.slice(-10);
          const average =
            lastTenPropertyValues.reduce((sum, value) => sum + value, 0) /
            lastTenPropertyValues.length;
          playerStats[property].values = playerData.games.map(
            (game) => game[property]
          );
          playerStats[property].average = average;
          const lastThirtyPropertyValues = propertyValues.slice(-30);

          // Calculate minimum
          const minimum = Math.min(...lastThirtyPropertyValues);

          // Calculate maximum
          const maximum = Math.max(...lastThirtyPropertyValues);

          // Calculate median (middle value)
          const sortedValues = lastThirtyPropertyValues.sort((a, b) => a - b);
          let median;
          if (sortedValues.length % 2 === 0) {
            const middle = sortedValues.length / 2;
            median = (sortedValues[middle - 1] + sortedValues[middle]) / 2;
          } else {
            median = sortedValues[Math.floor(sortedValues.length / 2)];
          }

          // Calculate quartiles (Q1, Q3)
          const q1 = calculateQuartile(sortedValues, 0.25);
          const q3 = calculateQuartile(sortedValues, 0.75);

          // Function to calculate quartiles
          function calculateQuartile(sortedArr, quartile) {
            const index = quartile * (sortedArr.length - 1);
            const lowerIndex = Math.floor(index);
            const fraction = index - lowerIndex;
            if (lowerIndex + 1 < sortedArr.length) {
              return (
                sortedArr[lowerIndex] * (1 - fraction) +
                sortedArr[lowerIndex + 1] * fraction
              );
            } else {
              return sortedArr[lowerIndex];
            }
          }

          // Now you can add these values to your gameStats object
          playerStats[property].summary = {
            minimum,
            maximum,
            median,
            q1,
            q3,
          };
        }

        playerAveragesFiltered.push(playerStats);
      }
      return playerAveragesFiltered;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  module.exports = main;
  // main();
// });
