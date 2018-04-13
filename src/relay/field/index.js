import { GraphQLInputObjectType, GraphQLString } from 'graphql';
import { attributeFields } from 'graphql-sequelize';
import { user, patient, eventType, event, reason } from '../../models';

export const userField = attributeFields(user, {
  allowNull: true,
  exclude: ['id', 'createdAt', 'updatedAt', 'password']
});

export const userInput = new GraphQLInputObjectType({
  name: 'userInput',
  fields: () => ({
    ...userField,
    password: {
      type: GraphQLString
    }
  })
});

export const patientField = attributeFields(patient, {
  allowNull: true,
  exclude: ['id', 'createdAt', 'updatedAt']
});

export const patientInput = new GraphQLInputObjectType({
  name: 'patientInput',
  fields: () => ({
    ...patientField
  })
});

export const eventTypeField = attributeFields(eventType, {
  allowNull: true,
  exclude: ['id', 'createdAt', 'updatedAt']
});

export const eventTypeInput = new GraphQLInputObjectType({
  name: 'eventTypeInput',
  fields: () => ({
    ...eventTypeField
  })
});

export const eventField = attributeFields(event, {
  allowNull: true,
  exclude: ['id', 'createdAt', 'updatedAt']
});

export const eventInput = new GraphQLInputObjectType({
  name: 'eventInput',
  fields: () => ({
    ...eventField
  })
});

export const reasonField = attributeFields(reason, {
  allowNull: true,
  exclude: ['id', 'createdAt', 'updatedAt']
});

export const reasonInput = new GraphQLInputObjectType({
  name: 'reasonInput',
  fields: () => ({
    ...reasonField
  })
});
