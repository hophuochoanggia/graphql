import { GraphQLList } from 'graphql';
import { Op } from 'sequelize';
import GraphQLJSON from 'graphql-type-json';
import models from '../../../models';
import User from '../../types/user';
import { resolverWithRole } from '../../../utils/resolverWithRole';

export default {
  type: new GraphQLList(User),
  args: {
    params: {
      type: GraphQLJSON,
    },
  },
  resolve: (root, { params: { username, offset = 0, filteredRole } }, { role }) =>
    resolverWithRole('users', role, {}, () => {
      const where = {};
      if (username) {
        where.username = {
          [Op.like]: `%${username}%`,
        };
      }
      if (filteredRole) {
        where.role = filteredRole;
      }
      return models.user.findAll({
        where,
        attributes: { exclude: ['password'] },
        offset,
        limit: 10,
      });
    }),
};
