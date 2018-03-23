import { GraphQLObjectType, GraphQLString } from "graphql";

export default new GraphQLObjectType({
  name: "Token",
  description: "Credential Token",
  fields() {
    return {
      token: {
        type: GraphQLString,
        description: "JWT token"
      },
      message: {
        type: GraphQLString,
        description: "message"
      },
      error: {
        type: GraphQLString,
        description: "error"
      }
    };
  }
});
