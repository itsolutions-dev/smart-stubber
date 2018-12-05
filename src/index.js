// / @flow

import fs from 'fs';
import path from 'path';
import express from 'express';
import * as handlers from './handlers/';
import { error, success } from './utils/logger';

type initConfiguration = {
  directory: ?string,
  port: number
};

const init = (
  { directory = './stubs', port = 8080 }: initConfiguration = {},
) => {
  const app = express();

  app.all('*', (req, res, next) => {
    const origin = req.get('Origin');
    const requestHeaders = req.get('Access-Control-Request-Headers');

    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    if (requestHeaders !== undefined) {
      res.header('Access-Control-Allow-Headers', requestHeaders);
    }
    res.header(
      'Access-Control-Allow-Methods',
      'POST, GET, PUT, DELETE, OPTIONS',
    );
    next();
  });

  fs.readdirSync(directory).forEach((file) => {
    Object.keys(handlers).map(x => handlers[x]).reduce((handled, handler) => {
      if (!handled) {
        const { tester, handle } = handler;
        if (tester.test(file)) {
          handle(app, path.join(directory, file));
        }
        return true;
      }
      return false;
    }, false);
  });

  app.listen(port, (err) => {
    if (err) {
      error(err);
      return;
    }

    success(`\nListening at http://localhost:${port}/`);
  });
};

export default init;
