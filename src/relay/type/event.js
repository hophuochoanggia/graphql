import { GraphQLObjectType } from 'graphql';
import { globalIdField } from 'graphql-relay';
import { resolver } from 'graphql-sequelize';
import { event, patient, eventType, reason } from '../../models';
import { eventField, eventTypeField, reasonField, patientField } from '../field';
import node from './node';

const { nodeInterface } = node;
export default new GraphQLObjectType({
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
          id: globalIdField(eventType.name),
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
