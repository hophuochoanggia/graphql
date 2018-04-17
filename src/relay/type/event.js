import { GraphQLInt, GraphQLEnumType, GraphQLObjectType } from 'graphql';
import { globalIdField } from 'graphql-relay';
import { resolver, relay } from 'graphql-sequelize';
import { event, patient, eventType as _eventType, reason } from '../../models';
import { eventField, eventTypeField, reasonField, patientField } from '../field';
import node from './node';

const { nodeInterface } = node;
const { sequelizeConnection } = relay;

const eventType = new GraphQLObjectType({
  name: event.name,
  fields: {
    id: globalIdField(event.name),
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
  where: (key, value) => ({ [key]: value })
});
