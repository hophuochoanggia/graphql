import User from "../../types/user.js";
import UserInput from "../../inputs/user.js";
import { createUser, findUserById } from "../../resolver/user.js";
import { resolverWithRole } from "../../../utils/resolverWithRole";

export default {
  type: User,
  args: {
    user: {
      type: UserInput
    }
  },
  resolve: (source, { user }, { id, role = null }) =>
    resolverWithRole("createUser", role, {}, () =>
      createUser(user).then(({ id }) => findUserById(id))
    )
};
