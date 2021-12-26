const {Command} = require("./commandModule");
let mineflayerBot;

const guildChatCommand = new Command("minecraft-guild", "Posts a message to guild chat", "minecraft-guild <message>", async (args, handler, discordMessage) => {
    if (args.length <= 0)
        return false;

    const message = args.join(" ");
    mineflayerBot.chat(`/gc ${message}`);
    discordMessage.reply(`Posted message to Guild chat`);

    return true;
});

const executeCommand = new Command("minecraft-execute", "Executes a slash command", "minecraft-execute <command>", async (args, handler, discordMessage) => {
    if (args.length <= 0)
        return false;

    try {
        args[0] = args[0].replace("/", "");
        const command = args.join(" ");

        mineflayerBot.once("messagestr", (message) => {
            discordMessage.reply(`Command output: ${message}`);
        });
        mineflayerBot.chat(`/${command}`);
    } catch (ex) {
        discordMessage.reply(`Error while executing command: \`\`\`${ex}\`\`\` `)
    }

    return true;
});

module.exports = (bot) => {
    mineflayerBot = bot;
    return [guildChatCommand, executeCommand];
};