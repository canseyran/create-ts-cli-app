#!/usr/bin/env node --no-warnings=ExperimentalWarning

import * as fs from 'fs/promises';
import * as path from 'path';
import chalk from 'chalk';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import packageJson from '../template/package.json' assert { type: 'json' };

const CURRENT_DIRECTORY_IDENTIFIER = '.';
const TEMPLATE_FOLDER_NAME = 'template';
const PATHS_TO_EXCLUDE = ['node_modules', 'dist'];
const DIRECTORY_VALIDATION_REGEXP = /^[^\s^\x00-\x1f\\?*:"";<>|\/.][^\x00-\x1f\\?*:"";<>|\/]*[^\s^\x00-\x1f\\?*:"";<>|\/.]+$/;
const GREEN_CHECKMARK = chalk.green('✔');

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
  DIRECTORY_ALREADY_EXISTS: () => {
    console.error('Specified directory already exists.\nMake sure to provide an unused project directory');
    process.exit(1);
  }
};

const StatusMessages = {
  START: () => console.log('---- Generating Typescript NodeJS CLI App ----'),
  COPYING_FILES: () => console.log('Copying files ...'),
  FILES_COPIED: (path) => console.log(`Files copied to ${path} ${GREEN_CHECKMARK}`),
  NPM_INSTALL: () => console.log('Installing packages ...'),
  PACKAGES_INSTALLED: () => console.log(`Packages installed ${GREEN_CHECKMARK}`),
  COMPLETE: (directory) => console.log(
    `Completed ${GREEN_CHECKMARK}\nChange into project directory:\n ${chalk.red('cd')} ${chalk.blue(directory)}\nStart in watch mode:\n ${chalk.red('npm run')} ${chalk.blue('dev')}\nUnit testing in watch mode:\n ${chalk.red('npm run')} ${chalk.blue('test:watch')}\nBuild a single file executable node script:\n ${chalk.red('npm run')} ${chalk.blue('build:script')}\n\nCheck package.json for additional scripts, happy coding!`
  ),
};

const main = async () => {
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

  if (!useCurrentDirectory && await fs.stat(projectDirectoryAbsPath).catch(() => false)) {
    ErrorHandlers.DIRECTORY_ALREADY_EXISTS();
  }

  StatusMessages.COPYING_FILES();

  if (!useCurrentDirectory) {
    await fs.mkdir(projectDirectoryAbsPath, { recursive: true });
  }

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const templateDirectoryAbsPath = path.join(__dirname, '..', TEMPLATE_FOLDER_NAME);

  try {
    await fs.cp(templateDirectoryAbsPath, projectDirectoryAbsPath, {
      recursive: true,
      filter: (source) => {
        return !PATHS_TO_EXCLUDE.some((excludedPath) => source.includes(excludedPath));
      }
    });

    packageJson.name = projectDirectoryArg;

    const packageJsonAbsPath = path.join(projectDirectoryAbsPath, 'package.json');
    await fs.writeFile(packageJsonAbsPath, JSON.stringify(packageJson, null, 2));

    StatusMessages.FILES_COPIED(projectDirectoryAbsPath);

    StatusMessages.NPM_INSTALL();
    spawnSync('npm', ['install'], { stdio: 'inherit', cwd: projectDirectoryAbsPath });

    StatusMessages.PACKAGES_INSTALLED();
    StatusMessages.COMPLETE(projectDirectoryArg);
  } catch (error) {
    console.error(`Error copying files: ${error.message}`);
    process.exit(1);
  }
};

main().catch(error => {
  console.error(`Unexpected error: ${error.message}`);
  process.exit(1);
});
