import { GraphQLInt } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import { resolverWithRole } from '../../utils/resolverWithRole';
import { modelName } from '../../config';
import capitalize from '../../utils/capitalize';
import models from '../../models';
import type from '../type';
import input from '../input';
import field from '../field';
import login from './login';
import { createEvent, editEventById } from './event';

const mutations = {
  createEvent,
  editEventById,
  login
};

// eslint-disable-next-line
modelName.map(name => {
  if (name !== 'event') {
    // event need custom mutation to handle through model
    const createMutationName = `create${capitalize(name)}`;
    const editMutationName = `edit${capitalize(name)}ById`;

    mutations[createMutationName] = mutationWithClientMutationId({
      name: createMutationName,
      inputFields: {
        ...field[`${name}Field`]
      },
      outputFields: () => ({
        response: {
          type: type[`${name}Type`],
          resolve: payload => payload.dataValues
        }
      }),
      mutateAndGetPayload: (params, { role }) =>
        resolverWithRole(createMutationName, role, {}, () => models[name].create(params))
    });

    mutations[editMutationName] = mutationWithClientMutationId({
      name: editMutationName,
      inputFields: {
        id: {
          type: GraphQLInt
        },
        data: {
          type: input[`${name}Input`]
        }
      },
      outputFields: () => ({
        response: {
          type: type[`${name}Type`],
          resolve: payload => payload.dataValues
        }
      }),
      mutateAndGetPayload: ({ id, data }, ctx) =>
        models[name].findById(id).then(instance =>
          resolverWithRole(
            editMutationName,
            ctx.role,
            {
              targetId: id,
              actorId: ctx.id,
              instance,
              model: name
            },
            () => instance.update(data)
          ))
    });
  }
});
export default mutations;
