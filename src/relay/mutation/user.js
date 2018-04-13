import { GraphQLInt, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import { user } from '../../models';
import { userType } from '../type';
import { userField, userInput } from '../field';
import { resolverWithRole } from '../../utils/resolverWithRole';

export const createUser = mutationWithClientMutationId({
  name: 'createUser',
  inputFields: {
    ...userField,
    password: {
      type: GraphQLString
    }
  },
  outputFields: () => ({
    response: {
      type: userType,
      resolve: payload => payload.dataValues
    }
  }),
  mutateAndGetPayload: (input, { role }) =>
    resolverWithRole('createUser', role, {}, () => user.create(input))
});
export const editUserById = mutationWithClientMutationId({
  name: 'editUserById',
  inputFields: {
    id: {
      type: GraphQLInt
    },
    data: {
      type: userInput
    }
  },
  outputFields: () => ({
    response: {
      type: userType,
      resolve: payload => payload.dataValues
    }
  }),
  mutateAndGetPayload: ({ id, data }, ctx) =>
    user.findById(id).then(instance =>
      resolverWithRole(
        'editUserById',
        ctx.role,
        {
          targetId: id,
          actorId: ctx.id,
          instance,
          model: 'user'
        },
        () => instance.update(data)
      ))
});
