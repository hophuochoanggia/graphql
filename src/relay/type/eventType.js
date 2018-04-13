import { GraphQLObjectType } from 'graphql';
import { globalIdField } from 'graphql-relay';
import { eventType } from '../../models';
import { eventTypeField } from '../field';
import node from './node';

const { nodeInterface } = node;

export default new GraphQLObjectType({
  name: eventType.name,
  fields: {
    id: globalIdField(eventType.name),
    ...eventTypeField
  },
  interfaces: [nodeInterface]
});
