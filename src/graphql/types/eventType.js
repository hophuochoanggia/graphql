import { GraphQLObjectType, GraphQLString } from 'graphql';
import GraphQLJSON from 'graphql-type-json';

export default new GraphQLObjectType({
  name: 'EventType',
  description: 'Event type',
  fields() {
    return {
      id: {
        type: GraphQLString,
        description: 'Event type ID',
      },
      name: {
        type: GraphQLString,
        description: 'Name of the event type',
      },
      metadata: {
        type: GraphQLJSON,
        description: 'Data structure of the type',
      },
      description: {
        type: GraphQLString,
        description: 'Description about the type',
      },
    };
  },
});
