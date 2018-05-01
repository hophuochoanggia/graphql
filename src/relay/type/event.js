import { GraphQLInt, GraphQLEnumType, GraphQLString, GraphQLObjectType } from 'graphql';
import { globalIdField } from 'graphql-relay';
import { resolver, relay } from 'graphql-sequelize';
import { user, event, patient, eventType as _eventType, reason } from '../../models';
import { eventField, eventTypeField, reasonField, patientField, userFieldPublic } from '../field';
import node from './node';

const { nodeInterface } = node;
const { sequelizeConnection } = relay;

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
    prevEvent: {
      type: new GraphQLObjectType({
        name: 'prevEvent',
        fields: {
          id: globalIdField(event.name),
          _id: {
            type: GraphQLInt,
            resolve: instance => instance.id
          },
          ...eventField
        },
        interfaces: [nodeInterface]
      }),
      resolve: resolver(event.prevEventId)
    },
    doctor: {
      type: new GraphQLObjectType({
        name: 'doctor',
        fields: {
          id: globalIdField(user.name),
          _id: {
            type: GraphQLInt,
            resolve: instance => instance.id
          },
          fullName: {
            type: GraphQLString,
            resolve: instance => `${instance.firstName} ${instance.lastName}`
          },
          ...userFieldPublic
        },
        interfaces: [nodeInterface]
      }),
      resolve: resolver(event.doctorId)
    },
    reportingSpecialist: {
      type: new GraphQLObjectType({
        name: 'reportingSpecialist',
        fields: {
          id: globalIdField(user.name),
          _id: {
            type: GraphQLInt,
            resolve: instance => instance.id
          },
          fullName: {
            type: GraphQLString,
            resolve: instance => `${instance.firstName} ${instance.lastName}`
          },
          ...userFieldPublic
        },
        interfaces: [nodeInterface]
      }),
      resolve: resolver(event.reportingSpecialistId)
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
