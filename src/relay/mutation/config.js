import { GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import { resolverWithRole } from '../../utils/resolverWithRole';
import { config, sequelize } from '../../models';
import { configType } from '../type';
import { configInput } from '../input';
import { configFieldForInput } from '../field';

export const createConfig = mutationWithClientMutationId({
  name: 'configCreate',
  inputFields: {
    ...configFieldForInput
  },
  outputFields: () => ({
    response: {
      type: configType.nodeType,
      resolve: payload => payload.dataValues
    }
  }),
  mutateAndGetPayload: (params, { role }) =>
    resolverWithRole('createConfig', role, {}, () => config.create(params))
});

export const editConfigByName = mutationWithClientMutationId({
  name: 'editConfigByName',
  inputFields: {
    name: {
      type: GraphQLString
    },
    data: {
      type: configInput
    }
  },
  outputFields: () => ({
    response: {
      type: configType.nodeType,
      resolve: payload => payload.dataValues
    }
  }),
  mutateAndGetPayload: ({ name, data }, ctx) =>
    config
      .findOne({ where: { name } })
      .then(instance =>
        resolverWithRole('editConfigByName', ctx.role, {}, () => instance.update(data)))
});
