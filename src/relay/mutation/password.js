import { GraphQLString, GraphQLInt, GraphQLBoolean } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { resolverWithRole } from '../../utils/resolverWithRole';
import { user } from '../../models';
import { comparePwd } from '../../utils/cryptPassword';

export default {
  generatePwd: mutationWithClientMutationId({
    name: 'changePwdById',
    inputFields: {
      id: { type: GraphQLInt }
    },
    outputFields: () => ({
      response: {
        type: GraphQLBoolean,
        resolve: () => true
      }
    }),
    mutateAndGetPayload: ({ id }, ctx) =>
      user.findById(id).then(instance =>
        resolverWithRole(
          'changePwd',
          ctx.role,
          {
            targetId: id,
            instance,
            model: 'user'
          },
          () => instance.generatePwd() // TODO: notify password by email
        ))
  }),
  setPwd: mutationWithClientMutationId({
    name: 'setPwd',
    inputFields: {
      old: { type: GraphQLString },
      password: { type: GraphQLString }
    },
    outputFields: () => ({
      response: {
        type: GraphQLBoolean,
        resolve: () => true
      }
    }),
    mutateAndGetPayload: ({ old, password }, ctx) =>
      user.findById(ctx.id).then(async instance => {
        const compare = await comparePwd(old, instance.password);
        if (!compare) return Promise.reject(new Error('Old password is incorrect'));
        return instance.setPwd(password);
      })
  })
};
