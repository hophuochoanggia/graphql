import { GraphQLObjectType, GraphQLInt, GraphQLEnumType } from 'graphql';
import { globalIdField } from 'graphql-relay';
import { relay } from 'graphql-sequelize';
import models from '../../models';
import patientType from './patient';
import eventType from './event';
import node from './node';
import { patientField, userFieldNoPwd } from '../field';

const { nodeInterface } = node;
const { sequelizeConnection } = relay;
const { user, Sequelize } = models;
const { Op } = Sequelize;

const userPatientConnection = sequelizeConnection({
  name: 'userPatient',
  nodeType: patientType,
  target: user.patients,
  orderBy: new GraphQLEnumType({
    name: 'UserPatientOrderBy',
    values: {
      AGE: { value: ['createdAt', 'DESC'] },
      LASTNAME: { value: ['lastName', 'ASC'] }
    }
  }),
  where: (key, value) => ({ [key]: { [Op.like]: `%${value}%` } }),
  connectionFields: {
    total: {
      type: GraphQLInt,
      resolve: ({ source }) => {
        source.countPatients();
      }
    }
  }
});

const userEventConnection = sequelizeConnection({
  name: 'userEvent',
  nodeType: eventType,
  target: user.events,
  orderBy: new GraphQLEnumType({
    name: 'UserEventOrderBy',
    values: {
      AGE: { value: ['createdAt', 'DESC'] }
    }
  }),
  // where: (key, value) => ({ [key]: { value } }),
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
  name: user.name,
  fields: {
    id: globalIdField(user.name),
    ...userFieldNoPwd,
    patients: {
      type: userPatientConnection.connectionType,
      args: {
        ...userPatientConnection.connectionArgs,
        ...patientField
      },
      resolve: userPatientConnection.resolve
    },
    events: {
      type: userEventConnection.connectionType,
      args: {
        ...userEventConnection.connectionArgs
      },
      resolve: userEventConnection.resolve
    }
  },
  interfaces: [nodeInterface]
});
