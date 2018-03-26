import { GraphQLID } from 'graphql';
import Event from '../types/event';
import EventInput from '../inputs/event';

export default {
  type: Event,
  args: {
    id: {
      type: GraphQLID,
    },
    input: {
      type: EventInput,
    },
  },
  model: 'event',
};
