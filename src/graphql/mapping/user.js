import { GraphQLID } from 'graphql';
import User from '../types/user';
import UserInput from '../inputs/user';

export default {
  type: User,
  args: {
    id: {
      type: GraphQLID,
    },
    input: {
      type: UserInput,
    },
  },
  model: 'user',
};
