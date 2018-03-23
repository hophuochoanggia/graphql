import { GraphQLList } from "graphql";
import GraphQLJSON from "graphql-type-json";
import { Op } from "sequelize";

import { findAllUser } from "../../resolver/user";
import User from "../../types/user";
import { resolverWithRole } from "../../../utils/resolverWithRole";

export default {
  type: new GraphQLList(User),
  args: {
    params: {
      type: GraphQLJSON
    }
  },
  resolve: (root, { params }, { role }) =>
    resolverWithRole("user", role, {}, () => findAllUser(params))
};
