const {Command} = require("./commandModule");
let mineflayerBot;

const guildChatCommand = new Command("minecraft-guild", "Posts a message to guild chat", "minecraft-guild <message>", async args => {
    const message = args.join(" ")
    mineflayerBot.chat(`/gc ${message}`);
    console.log(`> Posted message to Guild chat`);

    return true;
});

module.exports = bot => {
    mineflayerBot = bot;
    return [guildChatCommand];
};