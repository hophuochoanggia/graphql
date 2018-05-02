import { GraphQLInt } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import { resolverWithRole } from '../../utils/resolverWithRole';
import { event, sequelize } from '../../models';
import { eventType } from '../type';
import { eventInput } from '../input';
import { eventField } from '../field';

export const createEvent = mutationWithClientMutationId({
  name: 'eventCreate',
  inputFields: {
    ...eventField
  },
  outputFields: () => ({
    response: {
      type: eventType.nodeType,
      resolve: payload => payload.dataValues
    }
  }),
  mutateAndGetPayload: (params, { role }) =>
    resolverWithRole('createEvent', role, {}, () => {
      let e;
      return sequelize
        .transaction(transaction =>
          event.create(params, { transaction }).then(instance => {
            e = instance;
            console.log(e.addUser);
            return Promise.all([
              instance.addUser(instance.requestingSpecialistId, {
                through: { role: 'REQUESTING SPECIALIST' },
                transaction
              }),
              instance.addUser(instance.doctorId, {
                through: { role: 'DOCTOR' },
                transaction
              })
            ]);
          }))
        .then(() => e) // this return the newly create event to graphql
        .catch(err => {
          throw err;
        });
    })
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
        () => instance.update(data)
      ))
});
