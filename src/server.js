import express from "express";
import bodyParser from "body-parser";
import models from "./models/index.js";
import GraphHTTP from "express-graphql";
import Schema from "./graphql";
import jwt from "express-jwt";

const env = process.env.NODE_ENV || "development";
const config = require(`${__dirname}/config/config.json`)[env];
const app = express();
const router = express.Router();

function startApp(instance, port) {
  instance.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}
models.sequelize
  .sync()
  .then(() => {
    startApp(app, config.PORT);
  })
  .catch(e => {
    throw new Error(e);
  });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/login", (req, res) => {
  res.status(200).send({ messages: "Success" });
});

app.use(
  jwt({
    secret: config.SECRET,
    credentialsRequired: false
  })
);

app.use((req, res, next) => {
  const ts = Math.round(new Date().getTime() / 1000);
  if (req && ts > req.exp) {
    res.status(404).send({
      error: "Token expires"
    });
  } else {
    next();
  }
});

app.use(
  "/graphql",
  GraphHTTP(req => ({
    schema: Schema,
    context: req.user,
    pretty: true,
    graphiql: false
  }))
);