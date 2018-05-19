import { GraphQLInt, GraphQLNonNull } from 'graphql';
import node from '../type/node';
import type from '../type';
import field from '../field';
import { modelName } from '../../config';
import { resolverWithRole } from '../../utils/resolverWithRole';

import viewer from './viewer';

const { nodeField } = node;
const queries = {
  node: nodeField,
  viewer
};
// eslint-disable-next-line
modelName.map(name => {
  const modelType = type[`${name}Type`];
  const modelField = field[`${name}Field`];
  if (modelType) {
    queries[name] = {
      type: modelType.connectionType,
      args: {
        id: {
          type: GraphQLInt
        },
        ...modelField
      },
      resolve: (options, args, ctx, info) =>
        resolverWithRole(name, ctx.role, {}, () => modelType.resolve(options, args, ctx, info))
    };
    queries[`${name}s`] = {
      type: modelType.connectionType,
      args: {
        ...modelType.connectionArgs,
        ...modelField
      },
      resolve: (options, args, ctx, info) =>
        resolverWithRole(`${name}s`, ctx.role, {}, () =>
          modelType.resolve(options, args, ctx, info))
    };
  }
});

export default queries;
