import { GraphQLObjectType } from 'graphql';
import { globalIdField } from 'graphql-relay';
import { reason } from '../../models';
import { reasonField } from '../field';
import node from './node';

const { nodeInterface } = node;

export default new GraphQLObjectType({
  name: reason.name,
  fields: {
    id: globalIdField(reason.name),
    ...reasonField
  },
  interfaces: [nodeInterface]
});
