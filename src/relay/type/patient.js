import { GraphQLEnumType, GraphQLObjectType, GraphQLInt } from 'graphql';
import { globalIdField } from 'graphql-relay';
import { resolver, relay } from 'graphql-sequelize';
import { user, patient } from '../../models';
import { userFieldPublic, patientField } from '../field';
import eventType from './event';
import node from './node';

const { nodeInterface } = node;
const { sequelizeConnection } = relay;

const patientEventConnection = sequelizeConnection({
  name: 'patientEvent',
  nodeType: eventType,
  target: patient.events,
  orderBy: new GraphQLEnumType({
    name: 'PatientEventOrderBy',
    values: {
      AGE: { value: ['createdAt', 'DESC'] }
    }
  }),
  where: (key, value) => ({ [key]: value }),
  connectionFields: {
    total: {
      type: GraphQLInt,
      resolve: ({ source }) => {
        source.countEvents();
      }
    }
  }
});

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
          ...userFieldPublic
        },
        interfaces: [nodeInterface]
      }),
      resolve: resolver(patient.consultant)
    },
    events: {
      type: patientEventConnection.connectionType,
      args: {
        ...patientEventConnection.connectionArgs
      },
      resolve: patientEventConnection.resolve
    }
  },
  interfaces: [nodeInterface]
});
