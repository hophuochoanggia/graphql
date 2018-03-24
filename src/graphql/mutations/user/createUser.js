import User from '../../types/user';
import UserInput from '../../inputs/user';
import { resolverWithRole } from '../../../utils/resolverWithRole';
import models from '../../../models';

export default {
  type: User,
  args: {
    input: {
      type: UserInput,
    },
  },
  resolve: (source, { input }, { role = null }) =>
    resolverWithRole('createUser', role, {}, () =>
      models.user.create(input).then(({ id }) => models.user.findById(id))),
};
