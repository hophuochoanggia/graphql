import { GraphQLInputObjectType } from 'graphql';
import { modelName } from '../config';
import field from './field';

const input = {
  viewerInput: new GraphQLInputObjectType({
    name: 'viewerInput',
    fields: () => ({
      ...field.viewerEditField
    })
  })
};
// eslint-disable-next-line
modelName.map(name => {
  input[`${name}Input`] = new GraphQLInputObjectType({
    name: `${name}Input`,
    fields: () => ({
      ...field[`${name}Field`]
    })
  });
});

input.eventInput = new GraphQLInputObjectType({
  name: 'eventInput',
  fields: () => ({
    ...field.eventField
  })
});
module.exports = input;
