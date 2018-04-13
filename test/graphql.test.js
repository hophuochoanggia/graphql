import { graphql } from 'graphql';
import { lensPath, view } from 'ramda';
import models from '../src/models';
import seeder from './seeder';
import schema from '../src/relay';

const edgePath = lensPath(['edges', 0, 'node']);
let data;
beforeAll(async () => {
  await models.sequelize.sync({ force: true, logging: false });
  data = await seeder(models);
});
// afterAll(() => );
const roles = ['SUPERADMIN', 'ADMIN', 'CONSULTANT', 'DOCTOR', 'SPECIALIST', 'DENTIST'];
describe('Sequelize', () => {
  describe('User', () => {
    test('Test login', async () => {
      const mutation = `
        mutation {
          login(input: {
            username: "superadmin"
            password: "12345"
          }) {
            token
          }
        }
      `;
      const result = await graphql(schema, mutation, {}, {});
      const { token } = result.data.login;
      expect(token).toBeDefined();
    });
    describe('createUser ACL', () => {
      const allowedRole = ['SUPERADMIN', 'ADMIN'];
      roles.map(role =>
        test(`As ${role}`, async () => {
          const mutation = `
            mutation {
              createUser(input: {
                username: "${Math.random()}",
                password:"12345",
                firstName:"Gia",
                lastName:"Ho",
                email:"hoanggia@gmail.com"
              }) {
                response {
                  username
                }
              }
            }
          `;
          const result = await graphql(schema, mutation, {}, { role });
          if (allowedRole.includes(role)) {
            const { response } = result.data.createUser;
            expect(response).toBeDefined();
          } else {
            const { message } = result.errors[0];
            expect(message).toBe('Unauthorized');
          }
        }));
    });
    describe('editUserById ACL', () => {
      const allowedRole = ['SUPERADMIN', 'ADMIN', 'CONSULTANT']; // Consultant is owner
      roles.map((role, index) =>
        test(`As ${role}`, async () => {
          const mutation = `
            mutation {
              editUserById(input: {
                id: 3
                data: {
                  firstName: "change",
                }
              }) {
                response {
                  firstName
                }
              }
            }
          `;
          const result = await graphql(schema, mutation, {}, { role, id: data.users[index].id });
          if (allowedRole.includes(role)) {
            const { response } = result.data.editUserById;
            expect(response.firstName).toBe('change');
          } else {
            const { message } = result.errors[0];
            expect(message).toBe('Unauthorized');
          }
        }));
    });
    describe('query list user ACL', () => {
      const allowedRole = ['SUPERADMIN', 'ADMIN'];
      roles.map((role, index) =>
        test(`As ${role}`, async () => {
          const query = `
            {
              users {
                firstName
              }
            }
          `;
          const result = await graphql(schema, query, {}, { role, id: data.users[index].id });
          if (allowedRole.includes(role)) {
            const { firstName } = result.data.users[0];
            expect(firstName).toBe('gia');
          } else {
            const { message } = result.errors[0];
            expect(message).toBe('Unauthorized');
          }
        }));
    });

    describe('query user ACL', () => {
      const allowedRole = ['SUPERADMIN', 'ADMIN', 'OWNER'];
      roles.map((role, index) =>
        test(`As ${role}`, async () => {
          const query = `
            {
              user(id:3) {
                username
                firstName
              }
            }
          `;
          const result = await graphql(schema, query, {}, { role, id: data.users[index].id });
          if (allowedRole.includes(role)) {
            const { username } = result.data.user;
            expect(username).toBe('consultant');
          } else {
            const { message } = result.errors[0];
            expect(message).toBe('Unauthorized');
          }
        }));
    });

    describe('user patient connection', () => {
      test('Should be able to include patient', async () => {
        const query = `
            {
              user(id:3) {
                patients(first: 1) {
                  edges {
                    node {
                      firstName
                    }
                  }
                }
              }
            }
          `;
        const result = await graphql(schema, query, {}, { role: 'SUPERADMIN' });
        const { firstName } = view(edgePath, result.data.user.patients);
        expect(firstName).toBe('patient');
      });
    });
  });

  describe('Patient', () => {
    describe('createPatient ACL', () => {
      const allowedRole = ['SUPERADMIN', 'ADMIN', 'CONSULTANT'];
      roles.map(role =>
        test(`As ${role}`, async () => {
          const mutation = `
            mutation {
              createPatient(input: {
                birthday: "2017-10-10",
                firstName: "patient",
                lastName: "patient",
                email: "hoanggia@gmail.com",
                consultantId: 3,
              }) {
                response {
                  firstName
                }
              }
            }
          `;
          const result = await graphql(schema, mutation, {}, { role });
          if (allowedRole.includes(role)) {
            const { response: { firstName } } = result.data.createPatient;
            expect(firstName).toBe('patient');
          } else {
            const { message } = result.errors[0];
            expect(message).toBe('Unauthorized');
          }
        }));
    });

    describe('editPatientById ACL', () => {
      const allowedRole = ['SUPERADMIN', 'ADMIN', 'CONSULTANT']; // Consultant is owner
      roles.map((role, index) =>
        test(`As ${role}`, async () => {
          const mutation = `
            mutation {
              editPatientById(input: {
                id: 1
                data: {
                  firstName: "change",
                }
              }) {
                response {
                  firstName
                }
              }
            }
          `;
          const result = await graphql(schema, mutation, {}, { role, id: data.users[index].id });
          if (allowedRole.includes(role)) {
            const { response: { firstName } } = result.data.editPatientById;
            expect(firstName).toBe('change');
          } else {
            const { message } = result.errors[0];
            expect(message).toBe('Unauthorized');
          }
        }));
    });
  });

  describe('Event Type', () => {
    describe('createEventType ACL', () => {
      const allowedRole = ['SUPERADMIN'];
      roles.map(role =>
        test(`As ${role}`, async () => {
          const mutation = `
            mutation {
              createEventType(input: {
                name: "cpap"
                metadata: {}
                description: "study"
              }) {
                response {
                  name
                }
              }
            }
          `;
          const result = await graphql(schema, mutation, {}, { role });
          if (allowedRole.includes(role)) {
            const { response: { name } } = result.data.createEventType;
            expect(name).toBe('CPAP');
          } else {
            const { message } = result.errors[0];
            expect(message).toBe('Unauthorized');
          }
        }));
    });

    describe('editEventTypeById ACL', () => {
      const allowedRole = ['SUPERADMIN'];
      roles.map((role, index) =>
        test(`As ${role}`, async () => {
          const mutation = `
            mutation {
              editEventTypeById(input: {
                id: 2
                data: {
                  name: "change"
                }
              }) {
                response {
                  name
                }
              }
            }
          `;
          const result = await graphql(schema, mutation, {}, { role, id: data.users[index].id });
          if (allowedRole.includes(role)) {
            const { response: { name } } = result.data.editEventTypeById;
            expect(name).toBe('CHANGE');
          } else {
            const { message } = result.errors[0];
            expect(message).toBe('Unauthorized');
          }
        }));
    });
  });

  describe('Event', () => {
    describe('createEvent ACL', () => {
      const allowedRole = ['SUPERADMIN', 'ADMIN', 'CONSULTANT'];
      roles.map(role =>
        test(`As ${role}`, async () => {
          const mutation = `
            mutation {
              createEvent(input: {
                date: "2017-10-10"
                data: {
                  score: 1
                }
                doctorId: 4
                requestingSpecialistId: 4
                typeId: 1
                patientId: 1
              }) {
                response {
                  date
                  data
                }
              }
            }
          `;
          const result = await graphql(schema, mutation, {}, { role });
          if (allowedRole.includes(role)) {
            const { response: { date, data: { score } } } = result.data.createEvent;
            expect(date).toBe('2017-10-10');
            expect(score).toBe(1);
          } else {
            const { message } = result.errors[0];
            expect(message).toBe('Unauthorized');
          }
        }));
    });

    describe('editEventById ACL', () => {
      const allowedRole = ['SUPERADMIN', 'ADMIN', 'CONSULTANT'];
      roles.map((role, index) =>
        test(`As ${role}`, async () => {
          const mutation = `
          mutation {
            editEventById(input: {
              id: 1
              data: {
                data: {
                  score: 2
                }
              }
            }) {
              response {
                data
              }
            }
          }
        `;
          const result = await graphql(schema, mutation, {}, { role, id: data.users[index].id });
          if (allowedRole.includes(role)) {
            const { response: { data: { score } } } = result.data.editEventById;
            expect(score).toBe(2);
          } else {
            const { message } = result.errors[0];
            expect(message).toBe('Unauthorized');
          }
        }));
    });
  });
});
