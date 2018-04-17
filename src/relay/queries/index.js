import { GraphQLString, GraphQLInt, GraphQLNonNull } from 'graphql';
// import { resolver } from 'graphql-sequelize';
import node from '../type/node';
import type from '../type';
import { modelName } from '../../config';
// import models from '../../models';
import { resolverWithRole } from '../../utils/resolverWithRole';

const { nodeField } = node;
const queries = {
  node: nodeField
};
// eslint-disable-next-line
modelName.map(name => {
  const modelType = type[`${name}Type`];
  if (modelType) {
    queries[name] = {
      type: modelType.connectionType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLInt)
        }
      },
      resolve: (options, args, ctx, info) => modelType.resolve(options, args, ctx, info)
    };
    queries[`${name}s`] = {
      type: modelType.connectionType,
      args: {
        ...modelType.connectionArgs,
        name: {
          description: 'Fuzzy-matched name of user',
          type: GraphQLString
        }
      },
      resolve: (options, args, ctx, info) =>
        // options.role = ctx.role;
        modelType.resolve(options, args, ctx, info)

      // resolve: (options, args, ctx, info) =>
      //  resolverWithRole(name, ctx.role, {}, () => modelType.resolve(options, args, ctx, info))
    };
  }
});

export default queries;
