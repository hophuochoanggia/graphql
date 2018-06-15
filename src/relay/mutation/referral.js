import { GraphQLInt, GraphQLBoolean } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";
import { resolverWithRole } from "../../utils/resolverWithRole";
import { referral } from "../../models";
import { referralField } from "../field";
import { referralType } from "../type";
import { referralInput } from "../input";

export const createReferral = mutationWithClientMutationId({
  name: "createReferral",
  inputFields: {
    ...referralField
  },
  outputFields: () => ({
    response: {
      type: referralType.nodeType,
      resolve: payload => payload.dataValues
    }
  }),
  mutateAndGetPayload: (params, { role }) =>
    resolverWithRole("createReferral", role, {}, () => referral.create(params))
});

export const editReferralById = mutationWithClientMutationId({
  name: "editReferralById",
  inputFields: {
    id: {
      type: GraphQLInt
    },
    data: {
      type: referralInput
    }
  },
  outputFields: () => ({
    response: {
      type: referralType.nodeType,
      resolve: payload => payload.dataValues
    }
  }),
  mutateAndGetPayload: ({ id, data }, ctx) =>
    referral.findById(id).then(instance => {
      if (instance.status !== "PENDING") {
        throw Error("The event cannot no longer be updated");
      }
      return resolverWithRole(
        "editReferralById",
        ctx.role,
        {
          targetId: id,
          actorId: ctx.id,
          instance,
          model: "referral"
        },
        () => instance.update(data)
      );
    })
});

export const deleteReferral = mutationWithClientMutationId({
  name: "referralDelete",
  inputFields: {
    id: {
      type: GraphQLInt
    }
  },
  outputFields: () => ({
    response: {
      type: GraphQLBoolean,
      resolve: payload => payload
    }
  }),
  mutateAndGetPayload: ({ id }, ctx) =>
    referral.findById(id).then(instance =>
      resolverWithRole(
        "deleteReferralById",
        ctx.role,
        {
          actorId: ctx.id,
          instance,
          model: "referral"
        },
        () => instance.destroy()
      )
    )
});
