// / @flow

import fs from 'fs';
import path from 'path';
import express from 'express';
import { error, success } from './utils/logger';

type initConfiguration = {
  directory: ?string,
  port: number
};

const init = (
  { directory = './stubs', port = 8080 }: initConfiguration = {},
) => {
  const app = express();

  fs.readdirSync(directory).forEach((file) => {
    if (!/\.json$/.test(file)) return;

    const source = fs.readFileSync(path.join(directory, file), 'utf8');
    const { url, method = 'get', status = 200, body } = JSON.parse(source);

    app[method.toLowerCase()](url, (req, res) => {
      res.status(status);
      if (body !== undefined) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(body));
      }
      res.send();
    });
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
