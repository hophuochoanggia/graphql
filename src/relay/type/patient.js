import { GraphQLObjectType } from 'graphql';
import { globalIdField } from 'graphql-relay';
import { resolver } from 'graphql-sequelize';
import { patient, user } from '../../models';
import { userField, patientField } from '../field';
import node from './node';

const { nodeInterface } = node;
export default new GraphQLObjectType({
  name: patient.name,
  fields: {
    id: globalIdField(user.name),
    ...patientField,
    consultant: {
      type: new GraphQLObjectType({
        name: 'consultant',
        fields: {
          id: globalIdField(user.name),
          ...userField,
        },
        interfaces: [nodeInterface],
      }),
      resolve: resolver(patient.consultant),
    },
  },
  interfaces: [nodeInterface],
});
