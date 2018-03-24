import { GraphQLID } from 'graphql';
import GraphQLJSON from 'graphql-type-json';
import Event from '../../types/event';
import { resolverWithRole } from '../../../utils/resolverWithRole';
import models from '../../../models';

export default {
  type: Event,
  args: {
    id: {
      type: GraphQLID,
    },
    data: {
      type: GraphQLJSON,
    },
  },
  resolve: (source, { id, data }, { role = null }) =>
    models.event
      .findById(id)
      .then(instance => resolverWithRole('editEventById', role, {}, () => instance.update(data))),
};
