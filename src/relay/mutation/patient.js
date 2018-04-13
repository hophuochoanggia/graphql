import { GraphQLInt } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import { patient } from '../../models';
import { patientType } from '../type';
import { patientField, patientInput } from '../field';
import { resolverWithRole } from '../../utils/resolverWithRole';

export const createPatient = mutationWithClientMutationId({
  name: 'createPatient',
  inputFields: { ...patientField },
  outputFields: {
    response: {
      type: patientType,
      resolve: payload => payload.dataValues
    }
  },
  mutateAndGetPayload: (input, { role }) =>
    resolverWithRole('createPatient', role, {}, () => patient.create(input))
});

export const editPatientById = mutationWithClientMutationId({
  name: 'editPatientById',
  inputFields: {
    id: {
      type: GraphQLInt
    },
    data: {
      type: patientInput
    }
  },
  outputFields: () => ({
    response: {
      type: patientType,
      resolve: payload => payload.dataValues
    }
  }),
  mutateAndGetPayload: ({ id, data }, ctx) =>
    patient.findById(id).then(instance =>
      resolverWithRole(
        'editPatientById',
        ctx.role,
        {
          actorId: ctx.id,
          instance,
          model: 'patient'
        },
        () => instance.update(data)
      ))
});
