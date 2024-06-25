'use strict';

var commander = require('commander');

const program = new commander.Command();

program.command("split").option("--first");

const options = program.opts();

console.log(options);
