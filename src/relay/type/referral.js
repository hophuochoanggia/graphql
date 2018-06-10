/* global Buffer */
import { GraphQLString, GraphQLEnumType, GraphQLObjectType, GraphQLInt } from 'graphql';
import { globalIdField } from 'graphql-relay';
import { resolver, relay } from 'graphql-sequelize';
import { referral, user } from '../../models';
import { referralField, userField } from '../field';
import node from './node';

const { nodeInterface } = node;
const { sequelizeConnection } = relay;

const referralType = new GraphQLObjectType({
  name: referral.name,
  fields: {
    id: globalIdField(referral.name),
    _id: {
      type: GraphQLInt,
      resolve: instance => instance.id
    },
    fullName: {
      type: GraphQLString,
      resolve: instance => `${instance.firstName} ${instance.lastName}`
    },
    ...referralField,
    doctor: {
      type: new GraphQLObjectType({
        name: 'doctorOfReferral',
        fields: {
          id: globalIdField(user.name),
          _id: {
            type: GraphQLInt,
            resolve: instance => instance.id
          },
          ...userField
        },
        interfaces: [nodeInterface]
      }),
      resolve: resolver(referral.doctor)
    }
  },
  interfaces: [nodeInterface]
});

export default sequelizeConnection({
  name: 'referral',
  nodeType: referralType,
  target: referral,
  connectionFields: {
    total: {
      type: GraphQLInt,
      resolve: () => referral.count()
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
    name: 'ReferralOrderBy',
    values: {
      createdAt: { value: ['createdAt', 'ASC'] }
    }
  }),
  where: (key, value) => ({
    [key]: value
  })
});
