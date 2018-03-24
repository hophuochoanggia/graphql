import { GraphQLID } from 'graphql';
import GraphQLJSON from 'graphql-type-json';
import EventType from '../../types/eventType';
import { resolverWithRole } from '../../../utils/resolverWithRole';
import models from '../../../models';

export default {
  type: EventType,
  args: {
    id: {
      type: GraphQLID,
    },
    data: {
      type: GraphQLJSON,
    },
  },
  resolve: (source, { id, data }, { role = null }) =>
    models.eventType
      .findById(id)
      .then(instance =>
        resolverWithRole('editEventTypeById', role, {}, () => instance.update(data))),
};
