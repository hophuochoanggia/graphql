import express from "express";
import bodyParser from "body-parser";
import jwt from "express-jwt";
import GraphHTTP from "express-graphql";
import cors from "cors";
import multer from "multer";
import multerS3 from "multer-s3";
import AWS from "aws-sdk";

import models from "./models";
import Schema from "./relay";

const env = process.env.NODE_ENV || "test";
const accessKeyId = process.env.AWS_ACCESS_KEY || "AKIAJT74QVA7FLG6RIXA";
const secretAccessKey =
  process.env.AWS_SECRET_KEY || "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";

AWS.config.update({
  accessKeyId,
  secretAccessKey
});

const s3 = new AWS.S3();
const upload = multer({
  storage: multerS3({
    s3,
    bucket: "bizman-test",
    acl: "public-read",
    contentDisposition: (req, file, cb) => {
      cb(null, `filename=${file.originalname}`);
    },
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, `${file.fieldname}/${Date.now().toString()}`);
    }
  })
});

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
    startApp(app, process.env.PORT || 8000);
  })
  .catch(e => {
    throw new Error(e);
  });

app.use("*", cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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

app.post("/referral", upload.single("referral"), (req, res) => {
  res.json(req.file);
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
