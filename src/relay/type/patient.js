import { GraphQLString, GraphQLEnumType, GraphQLObjectType, GraphQLInt } from 'graphql';
import { globalIdField } from 'graphql-relay';
import { resolver, relay } from 'graphql-sequelize';
import { user, patient, sequelize } from '../../models';
import { userFieldPublic, patientField } from '../field';
import eventType from './event';
import node from './node';

const { nodeInterface } = node;
const { sequelizeConnection } = relay;
const { Op } = sequelize;

const patientEventConnection = sequelizeConnection({
  name: 'patientEvent',
  nodeType: eventType.nodeType,
  target: patient.events,
  orderBy: new GraphQLEnumType({
    name: 'PatientEventOrderBy',
    values: {
      AGE: { value: ['createdAt', 'DESC'] }
    }
  }),
  where: (key, value) => ({
    [key]: value
  }),
  connectionFields: {
    total: {
      type: GraphQLInt,
      resolve: ({ source }) => {
        source.countEvents();
      }
    }
  }
});

const patientType = new GraphQLObjectType({
  name: patient.name,
  fields: {
    id: globalIdField(patient.name),
    _id: {
      type: GraphQLInt,
      resolve: instance => instance.id
    },
    fullName: {
      type: GraphQLString,
      resolve: instance => `${instance.firstName} ${instance.lastName}`
    },
    ...patientField,
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

export default sequelizeConnection({
  name: 'patient',
  nodeType: patientType,
  target: patient,
  connectionFields: {
    total: {
      type: GraphQLInt,
      resolve: () => patient.count()
    }
  },
  edgeFields: {
    index: {
      type: GraphQLInt,
      resolve: edge =>
        Buffer.from(edge.cursor, 'base64')
          .toString('ascii')
          .split('$')
          .pop()
    }
  },
  orderBy: new GraphQLEnumType({
    name: 'PatientOrderBy',
    values: {
      firstName: { value: ['firstName', 'ASC'] },
      lastName: { value: ['lastName', 'ASC'] }
    }
  }),
  where: (key, value) => {
    if (key === 'name') {
      return {
        name: {
          [Op.like]: ' % $ { value } % '
        }
      };
    }

    return {
      [key]: value
    };
  }
});
