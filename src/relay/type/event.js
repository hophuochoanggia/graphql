/* global Buffer */
import { GraphQLInt, GraphQLString, GraphQLEnumType, GraphQLObjectType } from 'graphql';
import { globalIdField } from 'graphql-relay';
import { resolver, relay } from 'graphql-sequelize';
import { user, event, patient, eventType as _eventType, reason } from '../../models';
import { userField, eventField, eventTypeField, reasonField, patientField } from '../field';
import node from './node';

const { nodeInterface } = node;
const { sequelizeConnection } = relay;

const userType = new GraphQLObjectType({
  name: `${user.name}TypeEdge`,
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
    }
  },
  interfaces: [nodeInterface]
});

const eventUserConnection = sequelizeConnection({
  name: 'eventUser',
  nodeType: userType,
  target: event.users,
  orderBy: new GraphQLEnumType({
    name: 'EventUserOrderBy',
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

const eventType = new GraphQLObjectType({
  name: event.name,
  fields: {
    id: globalIdField(event.name),
    _id: {
      type: GraphQLInt,
      resolve: instance => instance.id
    },
    ...eventField,
    patient: {
      type: new GraphQLObjectType({
        name: 'patientOfEvent',
        fields: {
          id: globalIdField(patient.name),
          ...patientField
        },
        interfaces: [nodeInterface]
      }),
      resolve: resolver(event.patient)
    },
    type: {
      type: new GraphQLObjectType({
        name: 'typeOfEvent',
        fields: {
          id: globalIdField(_eventType.name),
          ...eventTypeField
        },
        interfaces: [nodeInterface]
      }),
      resolve: resolver(event.type)
    },
    inactiveReason: {
      type: new GraphQLObjectType({
        name: 'inactiveReasonOfEvent',
        fields: {
          id: globalIdField(reason.name),
          ...reasonField
        },
        interfaces: [nodeInterface]
      }),
      resolve: resolver(event.reason)
    },
    users: {
      type: eventUserConnection.connectionType,
      args: {
        ...eventUserConnection.connectionArgs
      },
      resolve: eventUserConnection.resolve
    }
  },
  interfaces: [nodeInterface]
});

export default sequelizeConnection({
  name: 'event',
  nodeType: eventType,
  target: event,
  connectionFields: {
    total: {
      type: GraphQLInt,
      resolve: () => event.count()
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
    name: 'eventOrderBy',
    values: {
      id: { value: ['id', 'ASC'] }
    }
  }),
  where: (key, value) => ({
    [key]: value
  })
});
