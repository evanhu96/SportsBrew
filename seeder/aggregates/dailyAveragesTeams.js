const BoxScore = require("../../server/models/BoxScore");
const db = require("../../server/config/connection");
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", async () => {
const main = async () => {
  try {
    const gameAverages = await BoxScore.aggregate([
      { $match: { playerId: "team" } }, // Filter for teams
      {
        $lookup: {
          from: "teamgames", // Assuming the name of the BoxScore collection in MongoDB
          let: { gameId: "$gameId", team: "$team" }, // Using variables for gameId and team
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$gameId", "$$gameId"] }, // Match game IDs
                    { $eq: ["$team", "$$team"] }, // Match the same team
                  ],
                },
              },
            },
            {
              $project: {
                _id: 0, // Exclude _id field if not needed
                vsScore: { $toInt: "$vsScore" }, // Convert vsScore to integer
              },
            },
          ],
          as: "teamGames",
        },
      },
      { $unwind: "$teamGames" },
      {
        $addFields: {
          vsScore: "$teamGames.vsScore", // Rename vsScore
        },
      },
      { $project: { teamGames: 0 } }, // Exclude the teamGames object
      // Other stages in your aggregation pipeline

      {
        $lookup: {
          from: "games",
          localField: "gameId",
          foreignField: "gameId",
          as: "game",
        },
      },
      {
        $unwind: "$game",
      },
      {
        $sort: {
          "game.dateEpoch": 1, // Sort by dateEpoch in descending order (-1 for descending)
        },
      },
      {
        $match: {
          "game.dateEpoch": { $gte: 2024 } // Filter for games from 2024 onwards
        }
      },

      {
        $group: {
          _id: "$team",
          games: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          _id: 0,
          playerId: "$_id",
          totalGames: { $size: "$games" },
          games: { $slice: ["$games", -10] }, // Limit to the last 10 games for each player
        },
      },
    ]);

    const gameAveragesFiltered = [];

    for (const gameData of gameAverages) {
      const gameStats = {
        playerId: gameData.playerId,
        name: gameData.playerId,
        type: "team",
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
        "vsScore",
      ];

      for (const property of propertiesToAverage) {
        gameStats[property] = {};
        const propertyValues = gameData.games.map((game) => game[property]);

        // Get the last 10 values or all available values if less than 10
        const lastTenPropertyValues = propertyValues.slice(-10);

        const average =
          lastTenPropertyValues.reduce((sum, value) => sum + value, 0) /
          lastTenPropertyValues.length;
        gameStats[property].values = gameData.games.map(
          (game) => game[property]
        );
        gameStats[property].average = average;

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
        gameStats[property].summary = {
          minimum,
          maximum,
          median,
          q1,
          q3,
        };
      }

      gameAveragesFiltered.push(gameStats);
    }
    // console.log(gameAveragesFiltered);
    return gameAveragesFiltered;
  } catch (error) {
    console.error("Error:", error);
  }
};

module.exports = main;
// main()
// })
