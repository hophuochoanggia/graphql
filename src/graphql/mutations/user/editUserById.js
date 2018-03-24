import { GraphQLID } from 'graphql';
import GraphQLJSON from 'graphql-type-json';
import User from '../../types/user';
import { resolverWithRole } from '../../../utils/resolverWithRole';
import models from '../../../models';

export default {
  type: User,
  args: {
    id: {
      type: GraphQLID,
    },
    data: {
      type: GraphQLJSON,
    },
  },
  resolve: (source, { id, data }, { ownerId, role = null }) =>
    models.user.findById(id).then(user =>
      resolverWithRole(
        'editUserById',
        role,
        {
          ownerId,
          targetId: user.id,
          targetRole: user.role,
          model: 'user',
        },
        () => user.update(data),
      )),
};
