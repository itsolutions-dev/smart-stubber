// @flow

import chalk from 'chalk';

export const log = (color: string, ...text: Array<string>) => {
  //eslint-disable-next-line
  console.log(chalk.bold[color](...text));
};

export const error = log.bind(null, 'red');
export const success = log.bind(null, 'green');
