import {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLSchema,
  GraphQLList,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
} from 'graphql';
import { GraphQLDate, GraphQLDateTime } from 'graphql-iso-date';
import { defaultListArgs, attributeFields, typeMapper } from 'graphql-sequelize';
import Sequelize from 'sequelize';

import sequelize from '../models';
import capitalize from '../utils/capitalize';
import { resolverWithRole } from '../utils/resolverWithRole';

const { models } = sequelize.sequelize.modelManager;
typeMapper.mapType((type) => {
  if (type instanceof Sequelize.UUID) {
    return GraphQLID;
  }

  if (type instanceof Sequelize.DATE) {
    return GraphQLDateTime;
  }

  if (type instanceof Sequelize.DATEONLY) {
    return GraphQLDate;
  }

  if (type instanceof Sequelize.ENUM) {
    return GraphQLString;
  }
  return false;
});

const type = {};
const queries = {};
const mutations = {};
models.forEach((m) => {
  const t = new GraphQLObjectType({
    name: m.name,
    fields: {
      ...attributeFields(m, { allowNull: true }),
    },
  });
  type[m.name] = t;

  // findById
  queries[m.name] = {
    type: t,
    args: {
      id: {
        type: GraphQLID,
      },
    },
    resolve: (root, { id }, { user }) =>
      resolverWithRole(m.name, user.role, { id, ownerId: user.id, model: m.name }, () =>
        m.findById(id)),
  };

  // findAll
  queries[`${m.name}s`] = {
    type: new GraphQLList(t),
    args: {
      offset: {
        type: GraphQLInt,
      },
      ...defaultListArgs(m),
    },
    resolve: (root, {
      limit, order, where, offset,
    }, { user }) =>
      resolverWithRole(m.name, user.role, { ownerId: user.id, model: m.name }, () => {
        if (where.username) {
          where.username = {
            [Sequelize.Op.like]: `%${where.username}%`,
          };
        }
        return m.findAll({
          where,
          attributes: { exclude: ['password'] },
          limit,
          order,
          offset,
        });
      }),
  };

  const inputType = new GraphQLInputObjectType({
    name: `${m.name}Input`,
    fields: () => ({
      ...attributeFields(m, { allowNull: true, exclude: ['id', 'createdAt', 'updatedAt'] }),
    }),
  });

  mutations[`create${capitalize(m.name)}`] = {
    type: t,
    args: {
      input: { type: inputType },
    },
    resolve: (source, { input }, { user }) =>
      resolverWithRole(`create${capitalize(m.name)}`, user.role, {}, () =>
        m.create(input).then(instance => instance)),
  };
  mutations[`edit${capitalize(m.name)}ById`] = {
    type: t,
    args: {
      id: {
        type: GraphQLID,
      },
      input: { type: inputType },
    },
    resolve: (source, { id, input }, { user }) =>
      m.findById(id).then(instance =>
        resolverWithRole(
          `edit${capitalize(m.name)}ById`,
          user.role,
          {
            id,
            ownerId: user.id,
            instance,
            model: 'user',
          },
          () => instance.update(input),
        )),
  };
});

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'query',
    fields: queries,
  }),
  mutation: new GraphQLObjectType({
    name: 'mutation',
    fields: mutations,
  }),
});
