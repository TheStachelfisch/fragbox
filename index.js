const consoleReader = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
});
const mineflayer = require("mineflayer");
let config;
try {
    config = require("./config.json");
} catch (ex) {
    if (ex instanceof Error && ex.code === "MODULE_NOT_FOUND")
        throw new Error("Error: Config wasn't found. Read TODO on how to configure the bot")
    else
        throw ex;
}

const bot = mineflayer.createBot({
    host: "mc.hypixel.net",
    username: config.email,
    password: config.password,
    auth: config.auth
});

bot.on("chat", (username, message) => {
    console.log(`${username}: ${message}`);
});

bot.once('spawn', () => {
    // Makes the bot go into Limbo
    bot.chat("/achat \u00a7c");
});

// Log errors and kick reasons:
bot.on('kicked', console.log);
bot.on('error', console.log);

consoleReader.on("line", input => {
    try {
        eval(input);
    } catch (error) {
        console.log(`An error occurred while executing this code: ${error}`);
    }
});