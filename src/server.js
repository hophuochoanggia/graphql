import express from 'express';
import bodyParser from 'body-parser';
import jwt from 'express-jwt';
import GraphHTTP from 'express-graphql';
import cors from 'cors';

import models from './models';
import Schema from './relay';

const env = process.env.NODE_ENV || 'test';
// eslint-disable-next-line
const config = require(`${__dirname}/config/config.json`)[env];
const app = express();
// const router = express.Router();

function startApp(instance, port) {
  instance.listen(port, () => {
    // eslint-disable-next-line
    console.log(`Server is listening on port ${port}`);
  });
}
models.sequelize
  .sync()
  .then(() => {
    startApp(app, process.env.PORT);
  })
  .catch(e => {
    throw new Error(e);
  });
app.use('*', cors({ origin: '*' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(jwt({
  secret: config.SECRET,
  credentialsRequired: false
}));

app.use((req, res, next) => {
  const ts = Math.round(new Date().getTime() / 1000);
  if (req && ts > req.exp) {
    res.status(404).send({
      error: 'Token expires'
    });
  }
  else {
    next();
  }
});

app.use(
  '/graphql',
  GraphHTTP(req => ({
    schema: Schema,
    context: req.user,
    pretty: true,
    graphiql: false
  }))
);
