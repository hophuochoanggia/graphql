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
  models.config.create({
    name: 'REFERRAL-METADATA',
    setting: {
      JSONSchema: {},
      UISchema: {}
    },
    description: 'Referal metadata'
  });
});

describe('Config Model', () => {
  describe('query list config ACL', () => {
    const allowedRole = ['SUPERADMIN', 'ADMIN', 'CONSULTANT', 'DOCTOR', 'DENTIST', 'SCIENTIST'];
    roles.map((role, index) =>
      test(`As ${role}`, async () => {
        const query = `{
          configs {
            edges {
              node {
                _id
                name
                setting
              }
            }
          }
        }`;
        const result = await graphql(schema, query, {}, { role, id: data.users[index].id });
        if (allowedRole.includes(role)) {
          const { name } = view(edgePath, result.data.configs);
          expect(name).toBe('REFERRAL-METADATA');
        } else {
          const { message } = result.errors[0];
          expect(message).toBe('Unauthorized');
        }
      }));
  });

  describe('query config ACL', () => {
    const allowedRole = ['SUPERADMIN', 'ADMIN', 'CONSULTANT', 'DOCTOR', 'DENTIST', 'SCIENTIST'];
    roles.map((role, index) =>
      test(`As ${role}`, async () => {
        const query = `
          {
            config(name: "REFERRAL-METADATA") {
              edges {
                node {
                  _id
                  name
                  setting
                }
              }
            }
          }
        `;
        const result = await graphql(schema, query, {}, { role, id: data.users[index].id });
        if (allowedRole.includes(role)) {
          const { name } = view(edgePath, result.data.config);
          expect(name).toBe('REFERRAL-METADATA');
        } else {
          const { message } = result.errors[0];
          expect(message).toBe('Unauthorized');
        }
      }));
  });

  describe('createConfig ACL', () => {
    const allowedRole = ['SUPERADMIN'];
    roles.map(role =>
      test(`As ${role}`, async () => {
        const mutation = `
          mutation {
            createConfig(input: {
              name: "${Math.random()}",
              setting: {
                JSONSchema: {},
                UISchema: {}
              },
              description: "test"
            }) {
              response {
                name
              }
            }
          }
        `;
        const result = await graphql(schema, mutation, {}, { role });
        if (allowedRole.includes(role)) {
          const { response: { name } } = result.data.createConfig;
          expect(name).toBeDefined();
        } else {
          const { message } = result.errors[0];
          expect(message).toBe('Unauthorized');
        }
      }));
  });
});
