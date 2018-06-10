import { GraphQLInt } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import { resolverWithRole } from '../../utils/resolverWithRole';
import { event, sequelize } from '../../models';
import { eventType } from '../type';
import { eventInput } from '../input';
import { eventFieldForInput } from '../field';

export const createEvent = mutationWithClientMutationId({
  name: 'createEvent',
  inputFields: {
    ...eventFieldForInput
  },
  outputFields: () => ({
    response: {
      type: eventType.nodeType,
      resolve: payload => payload.dataValues
    }
  }),
  mutateAndGetPayload: (params, { role }) =>
    resolverWithRole('createEvent', role, {}, () => sequelize
      .transaction(transaction => event.create(params, { transaction }))
      .catch(err => {
        throw err;
      }))
});

export const editEventById = mutationWithClientMutationId({
  name: 'editEventById',
  inputFields: {
    id: {
      type: GraphQLInt
    },
    data: {
      type: eventInput
    }
  },
  outputFields: () => ({
    response: {
      type: eventType.nodeType,
      resolve: payload => payload.dataValues
    }
  }),
  mutateAndGetPayload: ({ id, data }, ctx) =>
    event.findById(id).then(instance =>
      resolverWithRole(
        'editEventById',
        ctx.role,
        {
          targetId: id,
          actorId: ctx.id,
          instance,
          model: 'event'
        },
        () => sequelize.transaction(transaction => instance.update(data, { transaction }))
      ))
});
