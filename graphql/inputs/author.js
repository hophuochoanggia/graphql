import {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLList,
} from 'graphql';

export default new GraphQLInputObjectType({
  name: 'authorinput',
  fields: () => ({
      name: { type: GraphQLString }
  })
});
