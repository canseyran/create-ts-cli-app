#!/usr/bin/env node
// Usage: npx create-my-template my-app

import { cp as copy, mkdirSync, readFileSync, writeFileSync, renameSync } from 'fs/promises';
import path from 'path';
import { cwd } from 'process';
import { sync as spawnSync } from 'child_process';

const projectName = process.argv[2];

const currentDir = cwd();
const projectDir = path.resolve(currentDir, projectName);
await mkdirSync(projectDir, { recursive: true });

const templateDir = path.resolve(new URL('template', import.meta.url).pathname);
await copy(templateDir, projectDir, { recursive: true });

await renameSync(
  path.join(projectDir, 'gitignore'),
  path.join(projectDir, '.gitignore')
);

const projectPackageJsonPath = path.join(projectDir, 'package.json');
const projectPackageJson = JSON.parse(await readFileSync(projectPackageJsonPath, 'utf8'));

projectPackageJson.name = projectName;

await writeFileSync(
  projectPackageJsonPath,
  JSON.stringify(projectPackageJson, null, 2)
);

spawnSync('npm', ['install'], { stdio: 'inherit' });

console.log('Success! Your new project is ready.');
console.log(`Created ${projectName} at ${projectDir}`);
