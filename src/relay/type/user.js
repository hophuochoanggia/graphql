import { GraphQLString, GraphQLObjectType, GraphQLInt, GraphQLEnumType } from 'graphql';
import { globalIdField } from 'graphql-relay';
import { relay } from 'graphql-sequelize';
import models from '../../models';
import patientType from './patient';
import eventType from './event';
import node from './node';
import { patientField, userField } from '../field';

const { nodeInterface } = node;
const { sequelizeConnection } = relay;
const { user, sequelize } = models;
const { Op } = sequelize;

const userPatientConnection = sequelizeConnection({
  name: 'userPatient',
  nodeType: patientType.nodeType,
  target: user.patients,
  orderBy: new GraphQLEnumType({
    name: 'UserPatientOrderBy',
    values: {
      AGE: { value: ['createdAt', 'DESC'] },
      LASTNAME: { value: ['lastName', 'ASC'] }
    }
  }),
  where: (key, value) => ({
    [key]: {
      [Op.like]: `%${value}%`
    }
  }),
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
  nodeType: eventType.nodeType,
  target: user.events,
  orderBy: new GraphQLEnumType({
    name: 'UserEventOrderBy',
    values: {
      AGE: { value: ['createdAt', 'DESC'] }
    }
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
const userType = new GraphQLObjectType({
  name: user.name,
  fields: {
    id: globalIdField(user.name),
    _id: {
      type: GraphQLInt,
      resolve: instance => instance.id
    },
    ...userField,
    fullName: {
      type: GraphQLString,
      resolve: instance => `${instance.firstName} ${instance.lastName}`
    },
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

export default sequelizeConnection({
  name: 'user',
  nodeType: userType,
  target: user,
  connectionFields: {
    total: {
      type: GraphQLInt,
      resolve: () => user.count()
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
    name: 'UserOrderBy',
    values: {
      firstName: { value: ['firstName', 'ASC'] },
      lastName: { value: ['lastName', 'ASC'] }
    }
  }),
  where: (key, value) => {
    if (key === 'name') {
      return {
        name: {
          [Op.like]: `%${value}%`
        }
      };
    }

    return {
      [key]: value
    };
  }
});
