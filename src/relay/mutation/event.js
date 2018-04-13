import { GraphQLInt } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import { event } from '../../models';
import { eventType } from '../type';
import { eventField, eventInput } from '../field';
import { resolverWithRole } from '../../utils/resolverWithRole';

export const createEvent = mutationWithClientMutationId({
  name: 'createEvent',
  inputFields: {
    ...eventField
  },
  outputFields: () => ({
    response: {
      type: eventType,
      resolve: payload => payload.dataValues
    }
  }),
  mutateAndGetPayload: (input, { role }) =>
    resolverWithRole('createEvent', role, {}, () => event.create(input))
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
      type: eventType,
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
        () => instance.update(data)
      ))
});
