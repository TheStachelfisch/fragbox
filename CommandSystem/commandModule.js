class CommandHandler {
    constructor(config, discordClient) {
        this.commands = {};
        this.commands[helpCommand.name] = helpCommand;
        this.config = config;
        this.discordClient = discordClient;

        discordClient.on(`messageCreate`, async message => {
            if (message.guild === null && !message.author.bot && config.WhiteListedManagers.includes(message.author.id)) {
                await this.handleCommand(message);
            }
        });
    }

    registerCommands(commands) {
        commands.forEach(command => this.commands[command.name.toLowerCase()] = command);
    }

    clearCommands() {
        this.commands = {};
        // Add default command again
        this.commands[helpCommand.name] = helpCommand;
    }

    async handleCommand(message) {
        const args = message.content.trim().split(" ");
        // At least 1 word and it contains the prefix
        if (args.length >= 1 && (args[0].charAt(0) === this.config.BotPrefix)) {
            const command = this.commands[args[0].toLowerCase().replace(this.config.BotPrefix, "")];
            if (command) {
                // Commands return false when the syntax was wrong
                if (await command.handler(args.filter((value, index) => index > 0), this, message) === false) {
                    message.reply(`Wrong syntax, use: ${command.usage}.`);
                }
            } else {
                message.reply(`Command not found. View ${helpCommand.name} for a list of commands`);
            }
        }
    }
}

class Command {
    constructor(name, description, usage, handler) {
        this.name = name;
        this.description = description;
        this.usage = usage;
        this.handler = handler;
    }
}

const helpCommand = new Command("help", "Prints all available commands", "help", (args, handler, message) => {
    const commands = handler.commands;
    let temp = "";
    Object.keys(commands).forEach(key => {
        const command = commands[key];
        temp += `${command.name} : ${command.description} -> ${command.usage}\n`;
    });
    message.reply(temp);
    return true;
});

module.exports = {
    CommandHandler,
    Command
};