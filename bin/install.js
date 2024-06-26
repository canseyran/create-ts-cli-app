#!/usr/bin/env node --no-warnings=ExperimentalWarning

import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";
import { spawn } from "node:child_process";
import packageJson from "../template/package.json" with {type: "json"};
import { spawnSync } from "child_process";

const CURRENT_DIRECTORY_IDENTIFIER = ".";
const TEMPLATE_FOLDER_NAME = "template";
const PATHS_TO_EXCLUDE = ["node_modules", "dist"];
const DIRECTORY_VALIDATION_REGEXP = /^[^\s^\x00-\x1f\\?*:"";<>|\/.][^\x00-\x1f\\?*:"";<>|\/]*[^\s^\x00-\x1f\\?*:"";<>|\/.]+$/;
const ERROR_MESSAGES = {
  MISSING_PROJECT_DIRECTORY: `Please specify the project directory:\n ${chalk.blue("create-ts-cli-app")} ${chalk.red("<project-directory>")}\n\nExamples:\n ${chalk.blue("create-ts-cli-app")} ${chalk.red("my-cli-app")}\n ${chalk.blue("create-ts-cli-app")} ${chalk.red(".")}`,
  INVALID_PROJECT_DIRECTORY: `Please specify a valid directory name`,
  DIRECTORY_ALREADY_EXISTS: `Specified directory already exists.\nMake sure to provide an used project directory`
}
const GREEN_CHECKMARK = chalk.green("✔")
const STATUS_MESSAGES = {
  START: `---- Generating Typescript NodeJS CLI App ----`,
  COPYING_FILES: `Copying files ...`,
  FILES_COPIED: `Files copied ${GREEN_CHECKMARK}`,
  NPM_INSTALL: `Installing packages ...`,
  PACKAGES_INSTALLED: `Packages installed ${GREEN_CHECKMARK}`,
  COMPLETE: `Completed ${GREEN_CHECKMARK}\nRun:\n cd <project-directory>\n npm run dev\n\nTo start developing!`,
}

function logErrorAndExit(errorMsg) {
  console.log(errorMsg)
  console.exit(1);
}

function logStatusMessage(statusMsg) {
  console.log(statusMsg);
}

logStatusMessage(STATUS_MESSAGES.START);

const projectDirectoryArg = process.argv[2];

if (!projectDirectoryArg) {
  logErrorAndExit(ERROR_MESSAGES.MISSING_PROJECT_DIRECTORY)
}

const isValidDirectoryName = DIRECTORY_VALIDATION_REGEXP.test(projectDirectoryArg);
const useCurrentDirectory = projectDirectoryArg.trim() === CURRENT_DIRECTORY_IDENTIFIER;

if (!isValidDirectoryName && !useCurrentDirectory) {
  logErrorAndExit(ERROR_MESSAGES.INVALID_PROJECT_DIRECTORY)
}

const projectDirectoryAbsPath = useCurrentDirectory ? process.cwd() : path.join(process.cwd(), projectDirectoryArg);

if (!useCurrentDirectory && fs.existsSync(projectDirectoryAbsPath)) {
  logErrorAndExit(ERROR_MESSAGES.DIRECTORY_ALREADY_EXISTS);
}

logStatusMessage(STATUS_MESSAGES.COPYING_FILES);

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

logStatusMessage(STATUS_MESSAGES.FILES_COPIED);

logStatusMessage(STATUS_MESSAGES.NPM_INSTALL);

spawnSync("npm", ["install"], { stdio: "ignore", cwd: projectDirectoryAbsPath });

logStatusMessage(STATUS_MESSAGES.PACKAGES_INSTALLED);

logStatusMessage(STATUS_MESSAGES.COMPLETE);
