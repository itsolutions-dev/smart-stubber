// / @flow

import fs from 'fs';
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
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

  fs.readdirSync(directory).forEach((file) => {
    handlers.reduce((handled, handler) => {
      if (!handled) {
        const { tester, handle } = handler;
        if (tester.test(file)) {
          handle(app, file);
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
