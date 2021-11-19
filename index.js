const mineflayer = require("mineflayer");
const {CommandHandler} = require("./CommandSystem/commandModule");

let config;
try {
    config = require("./config.json");
} catch (ex) {
    if (ex instanceof Error && ex.code === "MODULE_NOT_FOUND")
        throw new Error("Error: Config wasn't found. Read TODO on how to configure the bot");
    else
        throw ex;
}

const bot = mineflayer.createBot({
    host: "mc.hypixel.net",
    username: config.email,
    password: config.password,
    auth: config.auth
});

bot.on("messagestr", (message, position, jsonMsg) => {
    console.log(`MESSAGE: ${message}`);
});

// Send the bot to Limbo
bot.once('spawn', () => {
    bot.chat("/achat \u00a7c");
});

// Log errors and kick reasons:
bot.on('kicked', console.log);
bot.on('error', console.log);

const commandHandler = new CommandHandler();
commandHandler.registerCommands((require("./CommandSystem/botCommands")(bot)))
