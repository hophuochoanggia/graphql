import { GraphQLList } from 'graphql';
import { Op } from 'sequelize';
import { resolverWithRole } from '../../utils/resolverWithRole';
import FilterInput from '../inputs/filter';
import models from '../../models';

export default {
  findById: args => ({
    ...args,
    resolve: (root, { id }, { user }) =>
      resolverWithRole(
        args.model,
        user.role,
        { id, ownerId: user.id, model: args.model },
        () => models[args.model].findById(id)
      ),
  }),
  find: args => ({
    args: { input: { type: FilterInput } },
    type: new GraphQLList(args.type),
    resolve: (
      root,
      { offset = 0, input: { username, filteredRole } },
      { user }
    ) =>
      resolverWithRole(`${args.model}s`, user.role, {}, () => {
        const where = {};
        if (username) {
          where.username = {
            [Op.like]: `%${username}%`,
          };
        }
        if (filteredRole) {
          where.role = filteredRole;
        }
        return models[args.model].findAll({
          where,
          attributes: { exclude: ['password'] },
          offset,
          limit: 10,
        });
      }),
  }),
};
