/* global Buffer*/
import {
  GraphQLString,
  GraphQLEnumType,
  GraphQLObjectType,
  GraphQLInt
} from "graphql";
import { globalIdField } from "graphql-relay";
import { relay } from "graphql-sequelize";
import { referral, patient, sequelize } from "../../models";
import { referralField } from "../field";
import eventType from "./event";
import node from "./node";

const { nodeInterface } = node;
const { sequelizeConnection } = relay;
const { Op } = sequelize;

const referralType = new GraphQLObjectType({
  name: referral.name,
  fields: {
    id: globalIdField(patient.name),
    _id: {
      type: GraphQLInt,
      resolve: instance => instance.id
    },
    fullName: {
      type: GraphQLString,
      resolve: instance => `${instance.firstName} ${instance.lastName}`
    },
    ...referralField
  },
  interfaces: [nodeInterface]
});

export default sequelizeConnection({
  name: "referral",
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
        Buffer.from(edge.cursor, "base64")
          .toString("ascii")
          .split("$")
          .pop()
    }
  },
  orderBy: new GraphQLEnumType({
    name: "ReferralOrderBy",
    values: {
      createdAt: { value: ["createdAt", "ASC"] }
    }
  }),
  where: (key, value) => {
    if (key === "name") {
      return {
        name: {
          [Op.like]: " % $ { value } % "
        }
      };
    }

    return {
      [key]: value
    };
  }
});
