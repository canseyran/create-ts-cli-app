#!/usr/bin/env node --no-warnings=ExperimentalWarning

import * as fs from 'fs/promises';
import * as path from 'path';
import chalk from 'chalk';
import { spawnSync } from 'child_process';
import { readFileSync } from 'fs';

const CURRENT_DIRECTORY_IDENTIFIER = '.';
const DIRECTORY_VALIDATION_REGEXP = /^[^\s^\x00-\x1f\\?*:"";<>|\/.][^\x00-\x1f\\?*:"";<>|\/]*[^\s^\x00-\x1f\\?*:"";<>|\/.]+$/;
const GREEN_CHECKMARK = chalk.green('✔');
const TEMPLATE_GITHUB_LINK = "https://github.com/canseyran/ts-cli-app";

const ErrorHandlers = {
  MISSING_PROJECT_DIRECTORY: () => {
    console.error(
      `Please specify the project directory:\n ${chalk.blue('create-ts-cli-app')} ${chalk.red('<project-directory>')}\n\nExamples:\n ${chalk.blue('create-ts-cli-app')} ${chalk.red('my-cli-app')}\n ${chalk.blue('create-ts-cli-app')} ${chalk.red('.')}`
    );
    process.exit(1);
  },
  INVALID_PROJECT_DIRECTORY: () => {
    console.error('Please specify a valid directory name');
    process.exit(1);
  },
};

const StatusMessages = {
  START: () => console.log('---- Generating Typescript NodeJS CLI App ----'),
  COPYING_FILES: () => console.log('Copying files ...'),
  FILES_COPIED: (dir) => console.log(`Files copied to ${dir} ${GREEN_CHECKMARK}`),
  NPM_INSTALL: () => console.log('Installing packages ...'),
  PACKAGES_INSTALLED: () => console.log(`Packages installed ${GREEN_CHECKMARK}`),
  COMPLETE: (dir) => console.log(
    `Completed ${GREEN_CHECKMARK}\nChange into project directory:\n ${chalk.red('cd')} ${chalk.blue(dir)}\nStart in watch mode:\n ${chalk.red('npm run')} ${chalk.blue('dev')}\nUnit testing in watch mode:\n ${chalk.red('npm run')} ${chalk.blue('test:watch')}\nBuild a single file executable node script:\n ${chalk.red('npm run')} ${chalk.blue('build:script')}\n\nCheck package.json for additional scripts, happy coding!`
  ),
};

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

StatusMessages.COPYING_FILES();

spawnSync('git', ['clone', '--depth', '1', TEMPLATE_GITHUB_LINK, projectDirectoryAbsPath]);

const packageJsonAbsPath = path.join(projectDirectoryAbsPath, 'package.json');
const packageJsonTxt = readFileSync(packageJsonAbsPath, 'utf-8');
const packageJson = JSON.parse(packageJsonTxt);
packageJson.name = projectDirectoryArg;
await fs.writeFile(packageJsonAbsPath, JSON.stringify(packageJson, null, 2));

StatusMessages.FILES_COPIED(projectDirectoryAbsPath);

StatusMessages.NPM_INSTALL();
spawnSync('npm', ['install'], { stdio: 'inherit', cwd: projectDirectoryAbsPath });
StatusMessages.PACKAGES_INSTALLED();

StatusMessages.COMPLETE(projectDirectoryArg);
