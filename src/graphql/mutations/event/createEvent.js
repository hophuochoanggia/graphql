import { GraphQLInputObjectType, GraphQLString } from 'graphql';
import GraphQLJSON from 'graphql-type-json';

import event from '../../types/event';
import { resolverWithRole } from '../../../utils/resolverWithRole';
import models from '../../../models';

export default {
  type: event,
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
    resolverWithRole('createEvent', role, {}, () =>
      models.event.create(input).then(({ id }) => models.event.findById(id))),
};
