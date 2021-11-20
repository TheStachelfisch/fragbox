const consoleReader = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
});

class CommandHandler {
    constructor() {
        this.commands = {};
        this.commands[helpCommand.name] = helpCommand;

        consoleReader.on("line", input => this.handleCommand(input));
    }

    registerCommands(commands) {
        commands.forEach(command => this.commands[command.name.toLowerCase()] = command)
    }

    async handleCommand(input) {
        const args = input.trim().split(" ");
        if (args.length > 0) {
            const command = this.commands[args[0].toLowerCase()];
            if (command) {
                if (await command.handler(args.filter((value, index) => index > 0), this) === false)
                    console.log(`>>> Wrong syntax, use: ${command.usage}.`);
            } else {
                console.log(`>>> Command not found. View ${helpCommand.name} for a list of commands`);
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

const helpCommand = new Command("help", "Prints all available commands", "help", (args, handler) => {
    const commands = handler.commands;
    Object.keys(commands).forEach(key => {
        const command = commands[key];
        console.log(`>>> ${command.name} : ${command.description} -> ${command.usage}`)
    });
    return true;
});

module.exports = {
    CommandHandler,
    Command
};