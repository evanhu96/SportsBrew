const TeamGame = require("../../server/models/Game");
const db = require("../../server/config/connection");

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async () => {
    // Update all games with home prop ="WSH" to "WAS"
    const filter = { team: "WSH" };
    const update = { team: "WAS" };

    try {
        const result = await TeamGame.updateMany(filter, update);
        console.log(`${result.nModified} games updated`);
    } catch (error) {
        console.error("Error updating games:", error);
    }
});
