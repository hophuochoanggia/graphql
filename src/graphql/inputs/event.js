import { GraphQLInputObjectType, GraphQLString } from 'graphql';
import GraphQLJSON from 'graphql-type-json';

export default new GraphQLInputObjectType({
  name: 'eventInput',
  fields: () => ({
    date: { type: GraphQLString },
    patient: { type: GraphQLString },
    consultant: { type: GraphQLJSON },
  }),
});
