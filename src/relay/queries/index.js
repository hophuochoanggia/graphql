import { GraphQLList, GraphQLInt, GraphQLNonNull } from 'graphql';
import { resolver } from 'graphql-sequelize';
import node from '../type/node';
import type from '../type';
import { modelName } from '../../config';
import models from '../../models';
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
      type: modelType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLInt)
        }
      },
      resolve: resolver(models[name], {
        before: (options, args, { role }) => resolverWithRole(name, role, {}, () => options)
      })
    };
    queries[`${name}s`] = {
      type: new GraphQLList(modelType),
      resolve: resolver(models[name], {
        before: (options, args, { role }) => resolverWithRole(`${name}s`, role, {}, () => options)
      })
    };
  }
});

export default queries;
