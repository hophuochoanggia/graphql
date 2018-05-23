import { GraphQLInt, GraphQLBoolean } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import { resolverWithRole } from '../../utils/resolverWithRole';
import { referral } from '../../models';

export const deleteReferral = mutationWithClientMutationId({
  name: 'referralDelete',
  inputFields: {
    id: {
      type: GraphQLInt
    }
  },
  outputFields: () => ({
    response: {
      type: GraphQLBoolean,
      resolve: payload => payload
    }
  }),
  mutateAndGetPayload: ({ id }, ctx) =>
    referral.findById(id).then(instance =>
      resolverWithRole(
        'deleteReferralById',
        ctx.role,
        {
          actorId: ctx.id,
          instance,
          model: 'referral'
        },
        () => instance.destroy()
      ))
});
