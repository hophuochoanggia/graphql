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
  /*
  describe('User Model', () => {
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
    describe('user connection', () => {
      test('Should be able to include event', async () => {
        const query = `
            {
              user(id:4) {
                edges {
                  node {
                    events(first: 10) {
                      edges {
                        node {
                          date
                        }
                      }
                    }
                  }
                }
              }
            }
          `;
        const result = await graphql(schema, query, {}, { role: 'SUPERADMIN' });
        const { date } = view(edgePath, view(edgePath, result.data.user).events);
        expect(date).toBe('2018-04-13');
      });
    });
    describe('changePwd ACL', () => {
      const allowedRole = ['SUPERADMIN', 'ADMIN'];
      roles.map(role =>
        test(`As ${role}`, async () => {
          const mutation = `
            mutation {
              generatePwd (input: {
                id: 4
              }) {
                response
              }
            }
          `;
          const result = await graphql(schema, mutation, {}, { role });
          if (allowedRole.includes(role)) {
            const { response } = result.data.generatePwd;
            expect(response).toBeTruthy();
          } else {
            const { message } = result.errors[0];
            expect(message).toBe('Unauthorized');
          }
        }));
    });

    describe('createUser ACL', () => {
      const allowedRole = ['SUPERADMIN', 'ADMIN'];
      roles.map(role =>
        test(`As ${role}`, async () => {
          const mutation = `
            mutation {
              createUser(input: {
                username: "${Math.random()}",
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
      const allowedRole = ['SUPERADMIN', 'ADMIN'];
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
            expect(response.firstName).toBe('Change');
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
            const { firstName } = view(edgePath, result.data.users);
            expect(firstName).toBe('Change');
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
                edges {
                  node {
                    username
                    firstName
                  }
                }
              }
            }
          `;
          const result = await graphql(schema, query, {}, { role, id: data.users[index].id });
          if (allowedRole.includes(role)) {
            const { username } = view(edgePath, result.data.user);
            expect(username).toBe('consultant');
          } else {
            const { message } = result.errors[0];
            expect(message).toBe('Unauthorized');
          }
        }));
    });

    describe('viewer', () => {
      test('viewer query', async () => {
        const query = `
          {
            viewer {
              edges {
                node {
                  username
                }
              }
            }
          }
        `;
        const result = await graphql(schema, query, {}, { id: data.users[0].id });
        const { username } = view(edgePath, result.data.viewer);
        expect(username).toBe('superadmin');
      });

      test('viewer edit', async () => {
        const query = `
          mutation {
            editViewer(input: {data: {firstName: "editViewer"}}) {
              response{
                firstName
              }
            }
          }
        `;
        const result = await graphql(schema, query, {}, { id: data.users[0].id });
        const { firstName } = result.data.editViewer.response;
        expect(firstName).toBe('EditViewer');
      });
    });
  });
  */
  /*
  describe('Patient Model', () => {
    describe('query event of a patient ACL', () => {
      test('event that belong to a user', async () => {
        const query = `
            {
              patient(id: 1) {
                edges {
                  node {
                    events {
                      edges {
                        node {
                          date
                          status
                        }
                      }
                    }
                  }
                }
              }
            }
          `;
        const result = await graphql(
          schema,
          query,
          {},
          { role: 'SUPERADMIN', id: data.users[1].id }
        );
        const { status } = view(edgePath, view(edgePath, result.data.patient).events);
        expect(status).toBe('active');
      });
    });
    describe('query list patient ACL', () => {
      const allowedRole = ['SUPERADMIN', 'ADMIN'];
      roles.map((role, index) =>
        test(`As ${role}`, async () => {
          const query = `
            {
              patients {
                edges {
                  node {
                    lastName
                  }
                }
              }
            }
          `;
          const result = await graphql(schema, query, {}, { role, id: data.users[index].id });
          if (allowedRole.includes(role)) {
            const { lastName } = view(edgePath, result.data.patients);
            expect(lastName).toBe('Patient');
          } else {
            const { message } = result.errors[0];
            expect(message).toBe('Unauthorized');
          }
        }));
    });
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
            expect(firstName).toBe('Patient');
          } else {
            const { message } = result.errors[0];
            expect(message).toBe('Unauthorized');
          }
        }));
    });

    describe('editPatientById ACL', () => {
      const allowedRole = ['SUPERADMIN', 'ADMIN']; // Consultant is owner
      roles.map((role, index) =>
        test(`As ${role}`, async () => {
          const mutation = `
            mutation {
              editPatientById(input: {
                id: 1
                data: {
                  firstName: "${role}",
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
            expect(firstName).toBe(capitalize(role));
          } else {
            const { message } = result.errors[0];
            expect(message).toBe('Unauthorized');
          }
        }));
    });
  });
  */
  /*
  describe('Event Type Model', () => {
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
  */

  describe('Event Model', () => {
    describe('query event ACL', () => {
      const allowedRole = ['SUPERADMIN', 'ADMIN'];
      roles.map((role, index) =>
        test(`As ${role}`, async () => {
          const query = `
            {
              event(id: 2) {
                edges {
                  node {
                    patient {
                      firstName
                    }
                    type {
                      name
                    }
                    inactiveReason {
                      description
                    }
                    users {
                      total
                      edges {
                        node {
                          fullName
                          role
                        }
                      }
                    }
                  }
                }
              }
            }
          `;
          const result = await graphql(schema, query, {}, { role, id: data.users[index].id });
          if (allowedRole.includes(role)) {
            const d = view(edgePath, result.data.event);
            const patientName = d.patient.firstName;
            const typeName = d.type.name;
            const { description } = d.inactiveReason;
            const { fullName } = view(edgePath, d.users);
            expect(patientName).toBe('Patient');
            expect(typeName).toBe('STUDY');
            expect(description).toBe('old');
            expect(fullName).toBe('Gia Ho');
          } else {
            const { message } = result.errors[0];
            expect(message).toBe('Unauthorized');
          }
        }));
    });
    describe('createEvent ACL', () => {
      const allowedRole = ['SUPERADMIN', 'ADMIN', 'CONSULTANT'];
      roles.map(role =>
        test(`As ${role}`, async () => {
          const mutation = `
            mutation {
              createEvent(input: {
                data: {
                  score: "from test"
                }
                typeId: 1
                patientId: 1
                consultant: 3
                doctor: 4
                specialist: 5
              }) {
                response {
                  data
                }
              }
            }
          `;
          const result = await graphql(schema, mutation, {}, { role });
          if (allowedRole.includes(role)) {
            const { response: { data: { score } } } = result.data.createEvent;
            expect(score).toBe('from test');
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
                consultant: 7
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
