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

  app.all('*', (req, res, next) => {
    const origin = req.get('Origin');
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

  fs.readdirSync(directory).forEach((file) => {
    if (!/\.json$/.test(file)) return;

    const source = fs.readFileSync(path.join(directory, file), 'utf8');
    const {
      url,
      regex,
      method = 'get',
      methods,
      status = 200,
      body,
    } = JSON.parse(source);

    (methods || [method]).forEach((verb) => {
      let listenTo;

      if (typeof url === 'string') {
        listenTo = url;
      } else if (typeof regex === 'string') {
        listenTo = new RegExp(regex);
      } else {
        listenTo = '';
      }

      console.log(`Adding ${verb} route: ${listenTo}`);

      app[verb.toLowerCase()](listenTo, (req, res) => {
        res.status(status);
        if (body !== undefined) {
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(body));
          return;
        }
        res.send();
      });
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
