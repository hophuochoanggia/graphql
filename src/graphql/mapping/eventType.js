import { GraphQLID } from 'graphql';
import EventType from '../types/eventType';
import EventTypeInput from '../inputs/eventType';

export default {
  type: EventType,
  args: {
    id: {
      type: GraphQLID,
    },
    input: {
      type: EventTypeInput,
    },
  },
  model: 'eventType',
};
