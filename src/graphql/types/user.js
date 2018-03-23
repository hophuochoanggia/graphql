import { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLID } from 'graphql';
import GraphQLJSON from 'graphql-type-json';

export default new GraphQLObjectType({
  name: 'User',
  description: 'User of the system',
  fields() {
    return {
      id: {
        type: GraphQLID,
        description: 'User Id',
        resolve: user => user.id,
      },
      username: {
        type: GraphQLString,
        description: 'username',
        resolve: user => user.username,
      },
      password: {
        type: GraphQLString,
        description: 'username',
      },
      firstName: {
        type: GraphQLString,
        description: 'firstName',
      },
      lastName: {
        type: GraphQLString,
        description: 'lastName',
      },
      address: {
        type: GraphQLString,
        description: 'firstName',
      },
      address2: {
        type: GraphQLString,
        description: 'lastName',
      },
      suburb: {
        type: GraphQLString,
        description: 'firstName',
      },
      state: {
        type: GraphQLString,
        description: 'lastName',
      },
      medicalCenter: {
        type: GraphQLString,
        description: 'Medical Center',
      },
      avatarUrl: {
        type: GraphQLString,
        description: 'Profile avatar',
      },
      isMale: {
        type: GraphQLBoolean,
        description: 'Gender',
      },
      isActive: {
        type: GraphQLBoolean,
        description: 'Account status',
      },
      workPhone: {
        type: GraphQLString,
        description: 'Work phone',
      },
      homePhone: {
        type: GraphQLString,
        description: 'Hone phone',
      },
      mobile: {
        type: GraphQLString,
        description: 'Mobile phone',
      },
      fax: {
        type: GraphQLString,
        description: 'Fax',
      },
      email: {
        type: GraphQLString,
        description: 'Email',
      },
      email2: {
        type: GraphQLString,
        description: 'Email2',
      },
      providerNo: {
        type: GraphQLString,
        description: 'Provider number',
      },
      role: {
        type: GraphQLString,
        description: 'Role',
      },
      legacy: {
        type: GraphQLJSON,
        description: 'Old data',
      },
    };
  },
});
