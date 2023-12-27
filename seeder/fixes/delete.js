const Play = require("../../server/models/Play");
const Game = require("../../server/models/Game");
const db = require("../../server/config/connection");
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async () => {
    try {
        // Find plays with gameID 401584691
        const playsToDelete = await Play.find({ gameId: "401584691" }).lean();
        // Delete found plays
        if (playsToDelete.length > 0) {
            await Play.deleteMany({ gameId: "401584691" });
            console.log(`Deleted ${playsToDelete.length} plays.`);
        } else {
            console.log("No plays found for the given gameID.");
        }

        // You might want to add some delay or additional logic here if needed
        // Example: await delay(1000);

        // Additional logic if needed after deleting plays
    } catch (error) {
        console.error("Error deleting plays:", error);
    }
});
