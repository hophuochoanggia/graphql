import { GraphQLInputObjectType } from 'graphql';
import { modelName } from '../config';
import field from './field';

const input = {};
// eslint-disable-next-line
modelName.map(name => {
  input[`${name}Input`] = new GraphQLInputObjectType({
    name: `${name}Input`,
    fields: () => ({
      ...field[`${name}Field`]
    })
  });
});
module.exports = input;
