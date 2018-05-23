import { GraphQLInt } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import { resolverWithRole } from '../../utils/resolverWithRole';
import { commonModel } from '../../config';
import capitalize from '../../utils/capitalize';
import models from '../../models';
import type from '../type';
import input from '../input';
import field from '../field';

import login from './login';
import password from './password';
import { createEvent, editEventById } from './event';
import { createConfig, editConfigByName } from './config';
import editViewer from './viewer';
import { deleteReferral } from './referral';

const mutations = {
  createEvent,
  editEventById,
  login,
  editViewer,
  ...password,
  createConfig,
  editConfigByName,
  deleteReferral
};

// eslint-disable-next-line
commonModel.map(name => {
  const createMutationName = `create${capitalize(name)}`;
  const editMutationName = `edit${capitalize(name)}ById`;
  mutations[createMutationName] = mutationWithClientMutationId({
    name: createMutationName,
    inputFields: {
      ...field[`${name}Field`]
    },
    outputFields: () => ({
      response: {
        type: type[`${name}Type`].nodeType,
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
        type: type[`${name}Type`].nodeType,
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
});
export default mutations;
