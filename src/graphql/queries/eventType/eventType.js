import { GraphQLID } from 'graphql';
import { resolverWithRole } from '../../../utils/resolverWithRole';
import eventType from '../../types/eventType';
import models from '../../../models';

export default {
  type: eventType,
  args: {
    targetId: {
      type: GraphQLID,
    },
  },
  resolve: (root, { targetId }, { id, role }) =>
    resolverWithRole('eventType', role, { model: 'eventType', ownerId: id, targetId }, () =>
      models.eventType.findById(targetId)),
};
