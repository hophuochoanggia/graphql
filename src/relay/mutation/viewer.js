import { mutationWithClientMutationId } from 'graphql-relay';
import { userType } from '../type';
import { viewerInput } from '../input';
import { user } from '../../models';

export default mutationWithClientMutationId({
  name: 'editViewer',
  inputFields: {
    data: {
      type: viewerInput
    }
  },
  outputFields: () => ({
    response: {
      type: userType.nodeType,
      resolve: payload => payload.dataValues
    }
  }),
  mutateAndGetPayload: ({ data }, { id }) =>
    user.findById(id).then(instance => instance.update(data))
});
