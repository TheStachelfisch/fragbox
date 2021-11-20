let config;
try {
    config = require("./config.json");
} catch (ex) {
    if (ex instanceof Error && ex.code === "MODULE_NOT_FOUND")
        throw new Error("Error: Config wasn't found. Read TODO on how to configure the bot");
    else
        throw ex;
}

const mineflayer = require("mineflayer");
let botOptions = {
    host: "mc.hypixel.net",
    username: config.email,
    password: config.password,
    auth: config.auth,
    viewDistance: "tiny",
    colorsEnabled: false,
};
const {CommandHandler} = require("./CommandSystem/commandModule");

let bot = mineflayer.createBot(botOptions);
bindBotEvents(bot);

function bindBotEvents(bot) {
    //#region Essential events
    //Send the bot to Limbo on spawn
    bot.once("spawn", () => {
        bot.chat("/achat \u00a7c");
        console.log(`Bot connected to Hypixel`);
    });

    // Log errors and kick reasons:
    bot.on("kicked", console.log);
    bot.on("error", console.log);
    //#endregion

    // Relog bot when it was disconnected
    bot.on("end", () => {
        console.log("Bot was disconnected from the server. Retrying in 30 seconds!");
        setTimeout(relog, 30000);
    });

    function relog() {
        console.log("Attempting to reconnect...");
        bot = mineflayer.createBot(botOptions);
        bindBotEvents(bot);
    }
}

const commandHandler = new CommandHandler();
commandHandler.registerCommands((require("./CommandSystem/minecraftCommands")(bot)));
commandHandler.registerCommands((require("./CommandSystem/systemCommands")(bot)));
