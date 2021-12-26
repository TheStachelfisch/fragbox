const fs = require("fs");

let config;
try {
    config = JSON.parse(fs.readFileSync("./config.json", "utf-8"));
} catch (ex) {
    if (ex.code === "ENOENT") {
        console.log("Configuration file not found. See TODO on how to configure the bot");
        process.exit(1);
    } else {
        throw ex;
    }
}

const {Client, Intents} = require('discord.js');
const client = new Client(
    {
        intents: [Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILDS],
        partials: ["MESSAGE", "CHANNEL"]
    }
);

const mineflayer = require("mineflayer");
let botOptions = {
    host: "mc.hypixel.net",
    username: config.email,
    // password: config.password,
    auth: config.auth,
    viewDistance: "tiny",
    colorsEnabled: false,
};
const {CommandHandler} = require("./CommandSystem/commandModule");
const commandHandler = new CommandHandler(config, client);

// Wait for the discord client to start the bot
client.once("ready", () => {
    console.log("Discord client is ready!\nStarting Minecraft bot");
    let bot = mineflayer.createBot(botOptions);
    bindBotEvents(bot);
});
client.login(config.DiscordToken);


function bindBotEvents(bot) {
    //#region Essential events
    //Send the bot to Limbo on spawn
    bot.once("spawn", () => {
        commandHandler.clearCommands();
        commandHandler.registerCommands((require("./CommandSystem/minecraftCommands")(bot)));
        commandHandler.registerCommands((require("./CommandSystem/systemCommands")(bot)));

        bot.chat("/achat \u00a7c");
        bot.chat("/p leave")
        console.log(`Bot connected to Hypixel`);
    });

    // Log errors and kick reasons:
    bot.on("kicked", console.log);
    bot.on("error", console.log);
    //#endregion

    // Relog bot when it was disconnected
    bot.on("end", () => {
        if (config.reconnect) {
            console.log("Bot was disconnected from the server. Retrying in 30 seconds!");
            setTimeout(relog, 30000);
        } else {
            console.log("Bot was disconnected. \`reconnect\` is set to false, not retrying!");
        }
    });

    bot.on("messagestr", message => {
        if (message.includes("invited you to join their party!") && !message.includes("Guild")) {
            const username = new RegExp("(\\w{3,16}) has invited you to join their party!").exec(message)[1];
            if (config.WhiteListedPeople.includes(username)) {
                bot.chat(`/p accept ${username}`);
            }
        }
    });

    function relog() {
        console.log("Attempting to reconnect...");
        bot = mineflayer.createBot(botOptions);
        bindBotEvents(bot);
    }
}
