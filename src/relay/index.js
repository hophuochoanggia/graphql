import { GraphQLSchema, GraphQLObjectType } from 'graphql';

import queries from './queries';
import mutations from './mutation';

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'query',
    fields: queries
  }),
  mutation: new GraphQLObjectType({
    name: 'mutation',
    fields: mutations
  })
});
