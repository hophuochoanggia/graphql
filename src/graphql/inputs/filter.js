import { GraphQLInputObjectType, GraphQLInt } from 'graphql';
import GraphQLJSON from 'graphql-type-json';

export default new GraphQLInputObjectType({
  name: 'filterInput',
  fields: () => ({
    where: { type: GraphQLJSON },
    offset: { type: GraphQLInt },
  }),
});
