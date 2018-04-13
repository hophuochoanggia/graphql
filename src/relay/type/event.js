import { GraphQLObjectType } from 'graphql';
import { globalIdField } from 'graphql-relay';
import { event } from '../../models';
import { eventField } from '../field';
import node from './node';

const { nodeInterface } = node;

export default new GraphQLObjectType({
  name: event.name,
  fields: {
    id: globalIdField(event.name),
    ...eventField
  },
  interfaces: [nodeInterface]
});
