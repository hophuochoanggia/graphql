import { graphql } from 'graphql';
import { lensPath, view } from 'ramda';
import models from '../../src/models';
import seeder from '../seeder';
import schema from '../../src/relay';

const roles = ['SUPERADMIN', 'ADMIN', 'CONSULTANT', 'DOCTOR', 'SPECIALIST', 'DENTIST'];
const edgePath = lensPath(['edges', 0, 'node']);
let data;

beforeAll(async () => {
  await models.sequelize.sync({ force: true, logging: false });
  data = await seeder(models);
  models.referral.create({
    firstName: 'test',
    lastName: 'test',
    birthday: '1989-12-10',
    email: 'test@test.com',
    data: {},
    doctorId: 4
  });
});

describe('Referral Model', () => {
  describe('query list referrral ACL', () => {
    const allowedRole = ['SUPERADMIN', 'ADMIN'];
    roles.map((role, index) =>
      test(`As ${role}`, async () => {
        const query = `{
          referrals {
            edges {
              node {
                firstName
                }
              }
            }
          }
        `;
        const result = await graphql(schema, query, {}, { role, id: data.users[index].id });
        if (allowedRole.includes(role)) {
          const { firstName } = view(edgePath, result.data.referrals);
          expect(firstName).toBe('test');
        } else {
          const { message } = result.errors[0];
          expect(message).toBe('Unauthorized');
        }
      }));
  });

  describe('query referral ACL', () => {
    const allowedRole = ['SUPERADMIN', 'ADMIN'];
    roles.map((role, index) =>
      test(`As ${role}`, async () => {
        const query = `{
          referral(id: 1) {
            edges {
              node {
                firstName
                doctor {
                  firstName
                }
              }
            }
          }
        }`;
        const result = await graphql(schema, query, {}, { role, id: data.users[index].id });
        if (allowedRole.includes(role)) {
          const { firstName, doctor } = view(edgePath, result.data.referral);
          expect(firstName).toBe('test');
          expect(doctor.firstName).toBe('Doctor');
        } else {
          const { message } = result.errors[0];
          expect(message).toBe('Unauthorized');
        }
      }));
  });

  describe('create referral ACL', () => {
    const allowedRole = ['DOCTOR'];
    roles.map((role, index) =>
      test(`As ${role}`, async () => {
        const query = `
          mutation {
            createReferral(input: {
              firstName: "acl"
              lastName: "test"
              birthday: "1989-12-10",
              email: "test@test.com",
              data: {},
              doctorId: 4
            }) {
              response {
                firstName
              }
            }
          }
        `;
        const result = await graphql(schema, query, {}, { role, id: data.users[index].id });
        if (allowedRole.includes(role)) {
          const { firstName } = result.data.createReferral.response;
          expect(firstName).toBe('acl');
        } else {
          const { message } = result.errors[0];
          expect(message).toBe('Unauthorized');
        }
      }));
  });

  describe('edit referral ACL', () => {
    const allowedRole = ['SUPERADMIN', 'ADMIN', 'DOCTOR'];
    roles.map((role, index) =>
      test(`As ${role}`, async () => {
        const query = `
          mutation {
            editReferralById(input: {
              id: 1,
              data: {
                firstName: "editAcl"
              }
            }) {
              response {
                firstName
              }
            }
          }
        `;
        const result = await graphql(schema, query, {}, { role, id: data.users[index].id });
        if (allowedRole.includes(role)) {
          const { firstName } = result.data.editReferralById.response;
          expect(firstName).toBe('editAcl');
        } else {
          const { message } = result.errors[0];
          expect(message).toBe('Unauthorized');
        }
      }));
  });
});
