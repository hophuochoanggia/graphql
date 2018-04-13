import { attributeFields } from 'graphql-sequelize';
import models from '../models';
import { modelName } from '../config';

let cache = {};
const field = {};
// eslint-disable-next-line
modelName.map(name => {
  field[`${name}Field`] = attributeFields(models[name], {
    allowNull: true,
    exclude: ['id', 'createdAt', 'updatedAt'],
    cache
  });
});

field.userFieldNoPwd = attributeFields(models.user, {
  allowNull: true,
  exclude: ['id', 'createdAt', 'updatedAt', 'password'],
  cache
});
module.exports = field;
