import { GraphQLInt, GraphQLEnumType, GraphQLObjectType } from 'graphql';
import { globalIdField } from 'graphql-relay';
import { relay } from 'graphql-sequelize';
import { reason } from '../../models';
import { reasonField } from '../field';
import node from './node';

const { nodeInterface } = node;
const { sequelizeConnection } = relay;

const reasonType = new GraphQLObjectType({
  name: reason.name,
  fields: {
    id: globalIdField(reason.name),
    _id: {
      type: GraphQLInt,
      resolve: instance => instance.id
    },
    ...reasonField
  },
  interfaces: [nodeInterface]
});

export default sequelizeConnection({
  name: 'reason',
  nodeType: reasonType,
  target: reason,
  connectionFields: {
    total: {
      type: GraphQLInt,
      resolve: () => reason.count()
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
    name: 'ReasonOrderBy',
    values: {
      id: { value: ['id', 'ASC'] }
    }
  }),
  where: (key, value) => ({ [key]: value })
});
