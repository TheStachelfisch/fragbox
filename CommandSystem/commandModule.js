const consoleReader = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
});

class CommandHandler {
    constructor(config) {
        this.commands = {};
        this.commands[helpCommand.name] = helpCommand;
        this.config = config;

        consoleReader.on("line", input => this.handleCommand(input));
    }

    registerCommands(commands) {
        commands.forEach(command => this.commands[command.name.toLowerCase()] = command);
    }

    clearCommands() {
        this.commands = {};
        // Add default command again
        this.commands[helpCommand.name] = helpCommand;
    }

    async handleCommand(input) {
        const args = input.trim().split(" ");
        // At least 1 word and it contains the prefix
        if (args.length >= 1 && (args[0].charAt(0) === this.config.BotPrefix)) {
            const command = this.commands[args[0].toLowerCase().replace(this.config.BotPrefix, "")];
            if (command)
                // Commands return false when the syntax was wrong
                if (await command.handler(args.filter((value, index) => index > 0), this) === false)
                    console.log(`>>> Wrong syntax, use: ${command.usage}.`);
                else
                    console.log(`>>> Command not found. View ${helpCommand.name} for a list of commands`);
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

const helpCommand = new Command("help", "Prints all available commands", "help", (args, handler) => {
    const commands = handler.commands;
    Object.keys(commands).forEach(key => {
        const command = commands[key];
        console.log(`>>> ${command.name} : ${command.description} -> ${command.usage}`);
    });
    return true;
});

module.exports = {
    CommandHandler,
    Command
};