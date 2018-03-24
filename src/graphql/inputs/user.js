import { GraphQLInputObjectType, GraphQLString, GraphQLBoolean } from 'graphql';
import GraphQLJSON from 'graphql-type-json';

export default new GraphQLInputObjectType({
  name: 'userInput',
  fields: () => ({
    username: { type: GraphQLString },
    password: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    address: { type: GraphQLString },
    address2: { type: GraphQLString },
    suburb: { type: GraphQLString },
    state: { type: GraphQLString },
    medicalCenter: { type: GraphQLString },
    avatarUrl: { type: GraphQLString },
    isMale: { type: GraphQLBoolean },
    isActive: { type: GraphQLBoolean },
    workPhone: { type: GraphQLString },
    homePhone: { type: GraphQLString },
    mobile: { type: GraphQLString },
    fax: { type: GraphQLString },
    email: { type: GraphQLString },
    email2: { type: GraphQLString },
    providerNo: { type: GraphQLString },
    role: { type: GraphQLString },
    legacy: { type: GraphQLJSON },
  }),
});
