import { GraphQLInputObjectType, GraphQLString } from 'graphql';
import GraphQLJSON from 'graphql-type-json';

import eventType from '../../types/eventType';
import { resolverWithRole } from '../../../utils/resolverWithRole';
import models from '../../../models';

export default {
  type: eventType,
  args: {
    input: {
      type: new GraphQLInputObjectType({
        name: 'eventTypeInput',
        fields: () => ({
          name: { type: GraphQLString },
          description: { type: GraphQLString },
          metadata: { type: GraphQLJSON },
        }),
      }),
    },
  },
  resolve: (source, { input }, { role = null }) =>
    resolverWithRole('createEventType', role, {}, () =>
      models.eventType.create(input).then(({ id }) => models.eventType.findById(id))),
};
