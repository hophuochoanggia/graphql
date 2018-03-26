import { GraphQLInputObjectType, GraphQLString } from 'graphql';
import GraphQLJSON from 'graphql-type-json';

export default new GraphQLInputObjectType({
  name: 'eventTypeInput',
  fields: () => ({
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    metadata: { type: GraphQLJSON },
  }),
});
