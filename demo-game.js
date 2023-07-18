const { Command } = require("commander");
const gameStory = require("./demo-game-story.json");
const inquirer = require("inquirer");

const startGame = (command) => {
  const scene = gameStory.scenes[command];

  console.log(scene.description);
  if (scene.choices.length === 0) {
    console.log("Congratulations on completing the game.");
    return;
  }
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
