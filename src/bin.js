#!/usr/bin/env node
import program from 'commander';
import init from './';
import { version } from '../package.json';

program
  .version(version)
  .option('-p, --port <port>', 'server port to use')
  .option(
    '-d, --dir <directory>',
    'specifies the directory that contains the stubs',
  )
  .parse(process.argv);

if (typeof program.dir !== 'string') {
  program.outputHelp();
  process.exit(0);
}

init(program);
