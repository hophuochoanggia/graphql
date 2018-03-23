import jwt from "jsonwebtoken";
import { GraphQLString } from "graphql";

import { comparePwd } from "../../../utils/cryptPassword";
import Token from "../../types/Token.js";
import CredentialInput from "../../inputs/credential.js";
import { findOneUser } from "../../resolver/user.js";

const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../../../config/config.json")[env];
const expiresIn = "7d";

export default {
  type: Token,
  args: {
    credential: {
      type: CredentialInput
    }
  },
  resolve(source, { credential }, ctx) {
    const { username, password } = credential;
    return findOneUser({ where: { username: username } }).then(async user => {
      if (user) {
        const compare = await comparePwd(password, user.password);
        if (compare) {
          const payload = {
            id: user.id,
            user: user.username,
            role: user.role
          };
          const token = jwt.sign(payload, config.SECRET, {
            expiresIn
          });
          return Promise.resolve({ message: "Success", token });
        } else {
          return Promise.reject({ message: "Login fails", token: null });
        }
      } else {
        return Promise.reject({ message: "No user found", token: null });
      }
    });
  }
};
