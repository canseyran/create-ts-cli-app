#!/usr/bin/env node --no-warnings=ExperimentalWarning

import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";
import { spawnSync } from "child_process";
import packageJson from "../template/package.json" with {type: "json"};

const CURRENT_DIRECTORY_IDENTIFIER = ".";
const TEMPLATE_FOLDER_NAME = "template";
const PATHS_TO_EXCLUDE = ["node_modules", "dist"];
const DIRECTORY_VALIDATION_REGEXP = /^[^\s^\x00-\x1f\\?*:"";<>|\/.][^\x00-\x1f\\?*:"";<>|\/]*[^\s^\x00-\x1f\\?*:"";<>|\/.]+$/;
const GREEN_CHECKMARK = chalk.green("✔")

const ErrorHandlers = {
  MISSING_PROJECT_DIRECTORY: () => {
    console.log(`Please specify the project directory:\n ${chalk.blue("create-ts-cli-app")} ${chalk.red("<project-directory>")}\n\nExamples:\n ${chalk.blue("create-ts-cli-app")} ${chalk.red("my-cli-app")}\n ${chalk.blue("create-ts-cli-app")} ${chalk.red(".")}`)
    console.exit(1);
  },
  INVALID_PROJECT_DIRECTORY: () => { console.log(`Please specify a valid directory name`); console.exit(1); },
  DIRECTORY_ALREADY_EXISTS: () => { console.log(`Specified directory already exists.\nMake sure to provide an used project directory`); console.exit(1); }
}

const StatusMessages = {
  START: () => console.log(`---- Generating Typescript NodeJS CLI App ----`),
  COPYING_FILES: () => console.log(`Copying files ...`),
  FILES_COPIED: (path) => console.log(`Files copied to ${path} ${GREEN_CHECKMARK}`),
  NPM_INSTALL: () => console.log(`Installing packages ...`),
  PACKAGES_INSTALLED: () => console.log(`Packages installed ${GREEN_CHECKMARK}`),
  COMPLETE: (directory) => console.log(`Completed ${GREEN_CHECKMARK}\nChange into project directory:\n ${chalk.red("cd")} ${chalk.blue(directory)}\nStart in watch mode:\n ${chalk.red("npm run")} ${chalk.blue("dev")}\nUnit testing in watch mode:\n ${chalk.red("npm run")} ${chalk.blue("test:watch")}\nBuild a single file executable node script:\n ${chalk.red("npm run")} ${chalk.blue("build:script")}\n\nCheck package.json for additional scripts, happy coding!`),
}

StatusMessages.START();

const projectDirectoryArg = process.argv[2];

if (!projectDirectoryArg) {
  ErrorHandlers.MISSING_PROJECT_DIRECTORY();
}

const isValidDirectoryName = DIRECTORY_VALIDATION_REGEXP.test(projectDirectoryArg);
const useCurrentDirectory = projectDirectoryArg.trim() === CURRENT_DIRECTORY_IDENTIFIER;

if (!isValidDirectoryName && !useCurrentDirectory) {
  ErrorHandlers.INVALID_PROJECT_DIRECTORY();
}

const projectDirectoryAbsPath = useCurrentDirectory ? process.cwd() : path.join(process.cwd(), projectDirectoryArg);

if (!useCurrentDirectory && fs.existsSync(projectDirectoryAbsPath)) {
  ErrorHandlers.DIRECTORY_ALREADY_EXISTS();
}

StatusMessages.COPYING_FILES();

if (!useCurrentDirectory) {
  fs.mkdirSync(projectDirectoryAbsPath, { recursive: true });
}

const templateDirectoryAbsPath = path.join(import.meta.dirname, "..", TEMPLATE_FOLDER_NAME);

fs.cpSync(templateDirectoryAbsPath, projectDirectoryAbsPath, {
  recursive: true, filter: (path) => {
    return !PATHS_TO_EXCLUDE.some((excludedPath) => path.includes(excludedPath));
  }
});

packageJson.name = projectDirectoryArg;

const packageJsonAbsPath = path.join(projectDirectoryAbsPath, "package.json");

fs.writeFileSync(packageJsonAbsPath, JSON.stringify(packageJson, undefined, 2))

StatusMessages.FILES_COPIED(projectDirectoryAbsPath);

StatusMessages.NPM_INSTALL();

spawnSync("npm", ["install"], { stdio: "ignore", cwd: projectDirectoryAbsPath });

StatusMessages.PACKAGES_INSTALLED()

StatusMessages.COMPLETE(projectDirectoryArg);
