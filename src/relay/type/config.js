import { GraphQLInt, GraphQLEnumType, GraphQLObjectType } from 'graphql';
import { globalIdField } from 'graphql-relay';
import { relay } from 'graphql-sequelize';
import { config } from '../../models';
import { configField } from '../field';
import node from './node';

const { nodeInterface } = node;
const { sequelizeConnection } = relay;

const configType = new GraphQLObjectType({
  name: config.name,
  fields: {
    id: globalIdField(config.name),
    _id: {
      type: GraphQLInt,
      resolve: instance => instance.id
    },
    ...configField
  },
  interfaces: [nodeInterface]
});

export default sequelizeConnection({
  name: 'config',
  nodeType: configType,
  target: config,
  connectionFields: {
    total: {
      type: GraphQLInt,
      resolve: () => config.count()
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
    name: 'ConfigOrderBy',
    values: {
      id: { value: ['id', 'ASC'] }
    }
  }),
  where: (key, value) => ({ [key]: value })
});
