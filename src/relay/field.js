import { GraphQLString } from 'graphql';
import { attributeFields, typeMapper } from 'graphql-sequelize';
import models from '../models';
import { modelName } from '../config';

let cache = {};
const field = {};
typeMapper.mapType(type => {
  // map enum as strings
  if (type instanceof models.Sequelize.ENUM) {
    return GraphQLString;
  }
  // use default for everything else
  return false;
});
// eslint-disable-next-line
modelName.map(name => {
  field[`${name}Field`] = attributeFields(models[name], {
    allowNull: true,
    exclude: ['id', 'password'],
    cache
  });
  // Input wont take createAt and updateAt
  field[`${name}FieldForInput`] = attributeFields(models[name], {
    allowNull: true,
    exclude: ['id', 'createdAt', 'updatedAt', 'password'],
    cache
  });
});

// To show in connection with other model(consultant)
field.userFieldPublic = attributeFields(models.user, {
  allowNull: true,
  exclude: ['id', 'createdAt', 'updatedAt', 'password', 'username'],
  cache
});

// Restrict viewer to change username, role
field.viewerEditField = attributeFields(models.user, {
  allowNull: true,
  exclude: ['id', 'createdAt', 'updatedAt', 'username', 'password', 'role'],
  cache
});

module.exports = field;
