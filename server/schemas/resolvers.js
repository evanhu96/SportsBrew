const { RosterSpot, Rankings, BoxScore, Player, Game } = require("../models");

const resolvers = {
  Query: {
    rankingsValues: async (_, { type, side, prop }) => {
      console.log(side, prop, type);
      try {
        const aggregatePipeline = [
          {
            $match: { type }, // Filter by type
          },
          {
            $project: {
              _id: 1,
              name: "$name", // Assuming 'type' field represents name
              value: `$${prop}.average`, // Access the 'prop' field and its 'average' property
            },
          },
          {
            $sort: {
              value: side, // Sort by value based on 'side' parameter
            },
          },
          {
            $limit: 32, // Limit to 10 results
          },
        ];

        const result = await Rankings.aggregate(aggregatePipeline);
        return result;
      } catch (error) {
        // Handle errors appropriately
        throw new Error("Could not fetch rankings: " + error.message);
      }
    },
    teamPlayers: async (_, { team }) => {
      try {
        const aggregatePipeline = [
          {
            $match: { team }, // Filter by type
          },

          {
            $project: {
              _id: 1,
              playerId: "$playerId",
              name: "$name", // Assuming 'type' field represents name
              MIN: `$MIN.values`, // Access the 'prop' field and its 'average' property
              FGA: `$FGA.values`, // Access the 'prop' field and its 'average' property
              FGM: `$FGM.values`, // Access the 'prop' field and its 'average' property
              FTA: `$FTA.values`, // Access the 'prop' field and its 'average' property
              FTM: `$FTM.values`, // Access the 'prop' field and its 'average' property
              OREB: `$OREB.values`, // Access the 'prop' field and its 'average' property
              DREB: `$DREB.values`, // Access the 'prop' field and its 'average' property
              REB: `$REB.values`, // Access the 'prop' field and its 'average' property
              AST: `$AST.values`, // Access the 'prop' field and its 'average' property
              STL: `$STL.values`, // Access the 'prop' field and its 'average' property
              BLK: `$BLK.values`, // Access the 'prop' field and its 'average' property
              TO: `$TO.values`, // Access the 'prop' field and its 'average' property
              PF: `$PF.values`, // Access the 'prop' field and its 'average' property
              plusMinus: `$plusMinus.values`, // Access the 'prop' field and its 'average' property
              PTS: `$PTS.values`, // Access the 'prop' field and its 'average' property
              type: 1,
            },
          },

          {
            $limit: 32, // Limit to 10 results
          },
        ];

        const result = await Rankings.aggregate(aggregatePipeline);
        const playerIds = result.map((player) => player.playerId);
        const epoch1MonthAgo = new Date().getTime() - 2592000000;
        const firstHitPipeLine = [
          { $match: { playerId: { $in: playerIds } } },
          {
            $lookup: {
              from: "firsthits",
              localField: "playerId",
              foreignField: "playerId",
              as: "firstHits",
            },
          },
          { $unwind: "$firstHits" }, // Deconstruct the array
          { $sort: { "firstHits.gameId": 1 } },
          {
            $group: {
              _id: "$_id", // Group by the original document's _id field
              // Reconstruct the firstHits array with sorted elements
              firstHits: { $push: "$firstHits" },
              playerId: { $first: "$playerId" },
            },
          },
        ];

        const firstHits = await Player.aggregate(firstHitPipeLine);
        const calculateAverages = (hits) => {
          const lastTenHits = hits.slice(-10); // Get the last ten objects

          const averages = {}; // Object to store property averages

          // Loop through each hit object
          lastTenHits.forEach((hit) => {
            // Loop through each property in the hit object
            Object.keys(hit).forEach((property) => {
              if (property !== "playerId" && property !== "gameId") {
                // Exclude non-numeric fields
                if (!averages[property]) {
                  averages[property] = { sum: 0, count: 0 };
                }

                if (typeof hit[property] === "number") {
                  // Check if property value is a number
                  averages[property].sum += hit[property]; // Add property value to sum
                  averages[property].count++; // Increment count for the property
                }
              }
            });
          });

          // Calculate averages
          const propertyAverages = {};
          Object.keys(averages).forEach((property) => {
            if (averages[property].count > 0) {
              propertyAverages[property] =
                averages[property].sum / averages[property].count;
            }
          });

          return propertyAverages;
        };

        // Get property averages
        const combinedData = [];
        for (const firstHit of firstHits) {
          const playerId = firstHit.playerId;
          const propertyAverages = calculateAverages(firstHit.firstHits);
          const playerData = result.find(
            (player) => player.playerId === playerId
          );
          playerData.firstHits = propertyAverages;
          combinedData.push(playerData);
        }
        return combinedData;
      } catch (error) {
        // Handle errors appropriately
        throw new Error("Could not fetch rankings: " + error.message);
      }
    },
    propCalc: async (_, { inputs, team }) => {
      console.log(inputs);
      const numOfNames = inputs.length;
      try {
        const playersAggregatePipeline = [
          {
            $match: { team: team }, // Filter by type
          },
          {
            $lookup: {
              from: "players", // Assuming 'players' is the name of the Player collection in MongoDB
              localField: "playerId",
              foreignField: "playerId",
              as: "playersInfo", // This will be an array containing matched player documents
            },
          },
          {
            $unwind: "$playersInfo", // Unwind the playersInfo array
          },
          {
            $match: {
              "playersInfo.name": {
                $in: inputs.map((input) => new RegExp(input.name, "i")),
              }, // Filter playersInfo array by na
            },
          },

          {
            $group: {
              _id: null,
              allPlayerIds: { $addToSet: "$playersInfo.playerId" }, // Collecting distinct playerIds into an array
              // Other fields you may want to retain
              playersInfo: { $push: "$playersInfo" }, // Collecting all playersInfo into an array
            },
          },
          {
            $project: {
              _id: 0,
              allPlayerIds: 1, // Keeping only the allPlayerIds array
              playersInfo: 1, // Keeping the playersInfo array
            },
          },
        ];

        const players = await RosterSpot.aggregate(playersAggregatePipeline);
        const playersWithData = players[0].playersInfo.map((player) => {
          // find playerid in inputs
          const playerObj = inputs.find(
            (input) => input.name.toLowerCase() === player.name.toLowerCase()
          );
          // console.log(playerObj)
          // console.log(player)
          const playerData = { ...player, ...playerObj };
          return playerData;
        });
        const ids = playersWithData.map((player) => player.playerId);
        const boxScoreAggregate = [
          {
            $match: {
              playerId: { $in: ids },
              MIN: { $gt: 0 },
            },
          },
          {
            $group: {
              _id: "$gameId",
              boxScores: { $push: "$$ROOT" },
              count: { $sum: 1 }, // Count the number of box scores per game
            },
          },
          {
            $match: {
              count: { $eq: numOfNames }, // Filter for games that have box scores for all players
            },
          },
          {
            $project: {
              _id: 0,
              gameId: "$_id",
              boxScores: 1,
            },
          },
        ];
        const boxScoreData = await BoxScore.aggregate(boxScoreAggregate);
        console.log(boxScoreData);
        // const result = await RosterSpot.aggregate(aggregatePipeline);
        // const results = result[0].gameBoxScores;
        var counter = 0;
        var streak = 0;
        for (var i = 0; i < boxScoreData.length; i++) {
          const game = boxScoreData[i];
          let allPlayersMetCondition = true; // Flag to track if all players met condition for this game

          // Loop through each player's data
          for (var j = 0; j < playersWithData.length; j++) {
            const currentPlayer = playersWithData[j];
            const boxScores = game.boxScores;
            const playerBoxScore = boxScores.find(
              (boxScore) => boxScore.playerId === currentPlayer.playerId
            );

            // Check if player's box score meets the condition
            if (
              playerBoxScore &&
              playerBoxScore[currentPlayer.prop] < currentPlayer.amount
            ) {
              allPlayersMetCondition = false; // Player didn't meet condition for this game
              streak = 0;
              break; // No need to check other players for this game
            }
          }

          // If all players met their condition, increment the counter
          if (allPlayersMetCondition) {
            counter++;
            streak++;
          }
        }
        console.log(boxScoreData.length);
        console.log(counter);
        console.log(streak);
        const hitRate = counter / boxScoreData.length;
        return {
          value: hitRate,
          streak: streak,
        };
      } catch (error) {
        // Handle errors appropriately
        throw new Error("Could not fetch rankings: " + error.message);
      }
    },
  },
};

module.exports = resolvers;
