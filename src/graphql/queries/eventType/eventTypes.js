import { GraphQLList } from 'graphql';
import { Op } from 'sequelize';
import GraphQLJSON from 'graphql-type-json';
import models from '../../../models';
import EventType from '../../types/eventType';
import { resolverWithRole } from '../../../utils/resolverWithRole';

export default {
  type: new GraphQLList(EventType),
  args: {
    params: {
      type: GraphQLJSON,
    },
  },
  resolve: (root, { params: { name, offset = 0 } }, { role }) =>
    resolverWithRole('eventTypes', role, {}, () => {
      const where = {};
      if (name) {
        where.name = {
          [Op.like]: `%${name}%`,
        };
      }
      return models.eventType.findAll({
        where,
        offset,
        limit: 10,
      });
    }),
};
