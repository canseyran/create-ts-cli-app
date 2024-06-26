import { Command } from "commander";

const program = new Command();

program
  .name("random-trivia-app")
  .description("CLI for fetching random trivia questions")
  .version("1.0.0");

program
  .command("fetch")
  .description("Fetch a random trivia question")
  .action(async () => {
    try {
      const response = await fetch("https://opentdb.com/api.php?amount=1");
      const data = await response.json();
      const question = data.results[0];
      console.log(`Category: ${question.category}`);
      console.log(`Type: ${question.type}`);
      console.log(`Difficulty: ${question.difficulty}`);
      console.log(`Question: ${question.question}`);
      if (question.type === "multiple") {
        console.log(
          `Options: ${question.incorrect_answers.concat(question.correct_answer).join(", ")}`,
        );
      }
      console.log(`Answer: ${question.correct_answer}`);
    } catch (error) {
      console.error("Error fetching trivia question:", error);
    }
  });

program.parse();
