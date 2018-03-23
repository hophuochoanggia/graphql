import { GraphQLInputObjectType, GraphQLString } from "graphql";
export default new GraphQLInputObjectType({
  name: "credentialInput",
  fields: () => ({
    username: { type: GraphQLString },
    password: { type: GraphQLString }
  })
});
