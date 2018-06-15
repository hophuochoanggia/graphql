import { GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";
import jwt from "jsonwebtoken";
import { comparePwd } from "../../utils/cryptPassword";
import models from "../../models";

const expiresIn = "100d";
const env = process.env.NODE_ENV || "dev";
const config = require("../../config/config.json")[env];

export default mutationWithClientMutationId({
  name: "login",
  inputFields: {
    username: { type: GraphQLString },
    password: { type: GraphQLString }
  },
  outputFields: () => ({
    token: {
      type: GraphQLString,
      description: "JWT token"
    }
  }),
  mutateAndGetPayload: async input => {
    const { username, password } = input;
    const user = await models.user.find({ where: { username } });
    if (!user) return Promise.reject(new Error("No user found"));
    const compare = await comparePwd(password, user.password);
    if (!compare) return Promise.reject(new Error("Login fails"));
    const payload = {
      id: user.id,
      user: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    };
    const token = jwt.sign(payload, config.SECRET, {
      expiresIn
    });
    return Promise.resolve({ message: "Success", token });
  }
});
