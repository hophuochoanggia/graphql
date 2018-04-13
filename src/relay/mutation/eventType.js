import { GraphQLInt } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import { eventType } from '../../models';
import { eventTypeType } from '../type';
import { eventTypeField, eventTypeInput } from '../field';
import { resolverWithRole } from '../../utils/resolverWithRole';

export const createEventType = mutationWithClientMutationId({
  name: 'createEventType',
  inputFields: {
    ...eventTypeField
  },
  outputFields: () => ({
    response: {
      type: eventTypeType,
      resolve: payload => payload.dataValues
    }
  }),
  mutateAndGetPayload: (input, { role }) =>
    resolverWithRole('createEventType', role, {}, () => eventType.create(input))
});
export const editEventTypeById = mutationWithClientMutationId({
  name: 'editEventTypeById',
  inputFields: {
    id: {
      type: GraphQLInt
    },
    data: {
      type: eventTypeInput
    }
  },
  outputFields: () => ({
    response: {
      type: eventTypeType,
      resolve: payload => payload.dataValues
    }
  }),
  mutateAndGetPayload: ({ id, data }, ctx) =>
    eventType.findById(id).then(instance =>
      resolverWithRole(
        'editEventTypeById',
        ctx.role,
        {
          targetId: id,
          actorId: ctx.id,
          instance,
          model: 'eventType'
        },
        () => instance.update(data)
      ))
});
