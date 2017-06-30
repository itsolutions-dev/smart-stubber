const handle = (app, file) => {
  const {
    url,
    regex,
    method = 'get',
    methods,
    status = 200,
    body,
  } = JSON.parse(file);

  (methods || [method]).forEach((verb) => {
    let listenTo;

    if (typeof url === 'string') {
      listenTo = url;
    } else if (typeof regex === 'string') {
      listenTo = new RegExp(regex);
    } else {
      listenTo = '';
    }

    // eslint-disable-next-line
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
};

export default {
  tester: /\.json$/,
  handle,
};
