import { GraphQLID } from "graphql";
import { findUserById } from "../../resolver/user.js";
import { resolverWithRole } from "../../../utils/resolverWithRole";
import User from "../../types/user.js";

export default {
  type: User,
  args: {
    targetId: {
      type: GraphQLID
    }
  },
  resolve: (root, { targetId }, { id, role }) =>
    resolverWithRole("user", role, { userId: id, targetId }, () =>
      findUserById(targetId)
    )
};
