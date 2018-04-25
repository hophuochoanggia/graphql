import { GraphQLInt, GraphQLEnumType, GraphQLObjectType } from 'graphql';
import { globalIdField } from 'graphql-relay';
import { relay } from 'graphql-sequelize';
import { eventType } from '../../models';
import { eventTypeField } from '../field';
import node from './node';

const { nodeInterface } = node;
const { sequelizeConnection } = relay;

const eventTypeType = new GraphQLObjectType({
  name: eventType.name,
  fields: {
    id: globalIdField(eventType.name),
    _id: {
      type: GraphQLInt,
      resolve: instance => instance.id
    },
    ...eventTypeField
  },
  interfaces: [nodeInterface]
});

export default sequelizeConnection({
  name: 'eventType',
  nodeType: eventTypeType,
  target: eventType,
  connectionFields: {
    total: {
      type: GraphQLInt,
      resolve: () => eventType.count()
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
    name: 'eventTypeOrderBy',
    values: {
      id: { value: ['id', 'ASC'] }
    }
  }),
  where: (key, value) => ({ [key]: value })
});
