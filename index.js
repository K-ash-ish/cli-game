const { Command } = require("commander");
const gameStory = require("./dragon-game-story.json");
const inquirer = require("inquirer");
const chalk = require("chalk");

const gameOver = (result, desc) => {
  const description =
    result === "victory" ? chalk.greenBright(desc) : chalk.redBright(desc);
  console.log("\n" + description + "\n");
};

const restartExit = () => {
  inquirer
    .prompt([
      {
        type: "input",
        message: `You want to restart/exit. *${chalk.greenBright(
          "start"
        )} *${chalk.red("exit")}`,
        name: "selectedOption",
      },
    ])
    .then((answer) => {
      if (answer.selectedOption === "exit") {
        console.log("Thank You");
        return;
      }
      startGame(answer.selectedOption);
    });
};

const startGame = (command) => {
  const scene = gameStory.scenes[command];
  if (command === "victory" || command === "defeat") {
    gameOver(command, scene.description);
    restartExit();
    return;
  }

  console.log("\n" + chalk.cyanBright(scene.description) + "\n");

  inquirer
    .prompt([
      {
        type: "list",
        message: "What do you want to do?",
        name: "selectedOption",
        choices: scene.choices.map((options) => options.option),
      },
    ])
    .then((answer) => {
      const nextScene = scene.choices.find(
        (choice) => choice.option === answer.selectedOption
      ).nextScene;
      startGame(nextScene);
    });
};
const program = new Command();
program
  .command("start")
  .description("Start the game...")
  .action(() => startGame("start"));

program.parse(process.argv);
