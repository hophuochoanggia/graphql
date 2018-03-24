import { GraphQLID } from 'graphql';
import { resolverWithRole } from '../../../utils/resolverWithRole';
import User from '../../types/user';
import models from '../../../models';

export default {
  type: User,
  args: {
    targetId: {
      type: GraphQLID,
    },
  },
  resolve: (root, { targetId }, { id, role }) =>
    resolverWithRole('user', role, { model: 'user', ownerId: id, targetId }, () =>
      models.user.findById(targetId)),
};
