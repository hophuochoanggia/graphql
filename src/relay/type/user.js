import { GraphQLObjectType, GraphQLInt, GraphQLEnumType } from 'graphql';
import { globalIdField } from 'graphql-relay';
import { relay } from 'graphql-sequelize';
import models from '../../models';
import patientType from './patient';
import node from './node';
import { userField, patientField } from '../field';

const { nodeInterface } = node;
const { sequelizeConnection } = relay;
const { user, Sequelize } = models;
const { Op } = Sequelize;

const userPatientConnection = sequelizeConnection({
  name: 'userPatient',
  nodeType: patientType,
  target: user.patients,
  orderBy: new GraphQLEnumType({
    name: 'UserPatientOrderBy',
    values: {
      AGE: { value: ['createdAt', 'DESC'] },
      LASTNAME: { value: ['lastName', 'ASC'] },
    },
  }),
  where: (key, value) => ({ [key]: { [Op.like]: `%${value}%` } }),
  connectionFields: {
    total: {
      type: GraphQLInt,
      resolve: ({ source }) => {
        source.countTasks();
      },
    },
  },
});

export default new GraphQLObjectType({
  name: user.name,
  fields: {
    id: globalIdField(user.name),
    ...userField,
    patients: {
      type: userPatientConnection.connectionType,
      args: {
        ...userPatientConnection.connectionArgs,
        ...patientField,
      },
      resolve: userPatientConnection.resolve,
    },
  },
  interfaces: [nodeInterface],
});
