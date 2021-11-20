const {Command} = require("./commandModule");
let bot;

const clearConsoleCommand = new Command("clear", "Clears the console", "clear", () => {
    console.clear();
    return true;
});

const evalCommand = new Command("eval", "Evaluates code", "eval <code>", args => {
    if (args.length <= 0)
        return false;
    const code = args.join(" ");

    try {
        eval(code)
        console.log(">>> Successfully evaluated code")
    } catch (ex) {
        console.log(`>>> Error while evaluating code: ${ex}`)
    }

    return true;
});

module.exports = mineflayerBot => {
    bot = mineflayerBot;
    return [clearConsoleCommand, evalCommand]
};