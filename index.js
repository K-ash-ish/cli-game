const { Command } = require("commander");
const gameStory = require("./dragon-game-story.json");
const inquirer = require("inquirer");
const chalk = require("chalk");
const figlet = require("figlet");
const { createSpinner } = require("nanospinner");

const spinner = createSpinner("Loading scene...");
const loading = async () => {
  spinner.start();
  await new Promise((resolve) => setTimeout(resolve, 500));
  spinner.success();
};
const asciiChar = (text) => {
  figlet(text, function (err, data) {
    if (err) {
      console.log("Something went wrong...");
      console.dir(err);
      return;
    }
    console.log(chalk.cyanBright(data));
  });
};

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
        message: `You want to restart/exit. * ${chalk.greenBright(
          "start"
        )} * ${chalk.red("exit/e")}`,
        name: "selectedOption",
      },
    ])
    .then((answer) => {
      if (answer.selectedOption === "exit" || answer.selectedOption === "e") {
        asciiChar("Thank You.");
        return;
      }
      startGame(answer.selectedOption);
    });
};

const startGame = async (command) => {
  const scene = gameStory.scenes[command];

  await loading();

  if (command === "victory" || command === "defeat") {
    gameOver(command, scene.description);
    restartExit();
    return;
  }

  console.log("\n" + chalk.cyanBright(scene.description) + "\n");

  const nextScene = await inquirer
    .prompt([
      {
        type: "list",
        message: "What do you want to do?",
        name: "selectedOption",
        choices: scene.choices.map((options) => options.option),
      },
    ])
    .then((answer) => {
      return scene.choices.find(
        (choice) => choice.option === answer.selectedOption
      ).nextScene;
    });
  await startGame(nextScene);
};
const program = new Command();
program
  .command("start")
  .description("Start the game...")
  .action(() => startGame("start"));

program.parse(process.argv);
