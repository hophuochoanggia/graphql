import { graphql } from 'graphql';
import { lensPath, view } from 'ramda';
import schema from '../src/graphql';
import models from '../src/models';
import { comparePwd } from '../src/utils/cryptPassword';
import { roles, roleResolver } from '../src/utils/resolverWithRole';

const lensCreate = lensPath(['data', 'createUser']);
const lensError = lensPath(['errors', 0]);
const createTesting = `
  mutation {
    createUser(input: {
      username:"testing",
      password:"12345",
      firstName:"Gia",
      lastName:"Ho",
      email:"hoanggia@gmail.com"
    }) {
      id
      username
    }
  }
`;

const createTESTING = `
  mutation {
    createUser(input: {
      username:"TESTING",
      password:"12345",
      firstName:"Gia",
      lastName:"Ho",
      email:"hoanggia@gmail.com"
    }) {
      id
      username
    }
  }
`;

const passwordHash = `
  mutation {
    createUser(input: {
      username:"hashing",
      password:"12345",
      firstName:"Gia",
      lastName:"Ho",
      email:"hoanggia@gmail.com"
    }) {
      id
      username
      password
    }
  }
`;

const fieldValidation = `
  mutation {
    createUser(input: {
      username:"has",
      password:"1234",
      firstName:"Gia",
      lastName:"Ho",
      email:"hogia@gmail.com"
    }) {
      username
      password
    }
  }
`;

let user = [];
beforeAll(async () => {
  user = await models.user.bulkCreate([
    {
      username: 'superadmin',
      password: '12345',
      firstName: 'Gia',
      lastName: 'Ho',
      email: 'hoanggia@gmail.com',
      role: 'superadmin',
    },
    {
      username: 'admin',
      password: '12345',
      firstName: 'Gia',
      lastName: 'Ho',
      email: 'hoanggia@gmail.com',
      role: 'admin',
    },
    {
      username: 'consultant',
      password: '12345',
      firstName: 'Gia',
      lastName: 'Ho',
      email: 'hoanggia@gmail.com',
      role: 'consultant',
    },
    {
      username: 'doctor',
      password: '12345',
      firstName: 'Gia',
      lastName: 'Ho',
      email: 'hoanggia@gmail.com',
      role: 'doctor',
    },
    {
      username: 'specialist',
      password: '12345',
      firstName: 'Gia',
      lastName: 'Ho',
      email: 'hoanggia@gmail.com',
      role: 'specialist',
    },
    {
      username: 'dentist',
      password: '12345',
      firstName: 'Gia',
      lastName: 'Ho',
      email: 'hoanggia@gmail.com',
      role: 'dentist',
    },
  ]);
});

afterAll(() => models.sequelize.sync({ force: true, logging: false }));

describe('User model', () => {
  test('Should be able to create user', async () => {
    const result = await graphql(
      schema,
      createTesting,
      {},
      { role: 'superadmin' }
    );
    const { username } = view(lensCreate, result);
    expect(username).toBe('testing');
  });
  test('Should not be able to create duplicate user', async () => {
    const result = await graphql(schema, createTesting);
    expect(result.errors).not.toBe(undefined);
  });
  test('Upper case username is the same as lower case', async () => {
    const result = await graphql(
      schema,
      createTESTING,
      {},
      { role: 'superadmin' }
    );
    const { message } = view(lensError, result);
    expect(message).toBe('User already exist');
  });
  test('Password should be hash', async () => {
    const result = await graphql(
      schema,
      passwordHash,
      {},
      { role: 'superadmin' }
    );
    const { password } = view(lensCreate, result);
    const compare = await comparePwd('12345', password);
    expect(password).not.toBe('12345');
    expect(compare).toBeTruthy();
  });
  test('Should has field validate error', async () => {
    const result = await graphql(
      schema,
      fieldValidation,
      {},
      { role: 'admin' }
    );
    const { message } = result.errors[0];
    const error = message.split('\n');
    expect(error[0]).toBe('Validation error: User name is not in range 4-30,');
    expect(error[1]).toBe(
      'Validation error: User password must be atleast 5 characters in length'
    );
  });
});
describe('User ACL', () => {
  describe('Query user', () => {
    // eslint-disable-next-line
    roles.map((role, i) => {
      const allowedRole = ['superadmin', 'admin', 'consultant'];
      test(`Should ${
        allowedRole.indexOf(role) > -1 ? '' : 'not'
      } allow to fetch consultant as ${role}/owner`, async () => {
        const query = `
          {
            user(
              id: "${user[2].id}"
            ) {
              username
            }
          }
        `;
        const result = await graphql(
          schema,
          query,
          {},
          { user: user[i].dataValues }
        );
        if (allowedRole.indexOf(role) > -1) {
          const { username } = result.data.user;
          expect(username).toBe('consultant');
        } else {
          expect(result.errors[0].message).toBe('Unauthorized');
        }
      });
    });
  });

  describe('Query users', () => {
    // eslint-disable-next-line
    roles.map((role, i) => {
      const allowedRole = ['superadmin', 'admin'];
      test(`Should ${
        allowedRole.indexOf(role) > -1 ? '' : 'not'
      } allow to fetch list user as ${role}`, async () => {
        const query = `
          {
            users(
              input: {
                where: {username:"admin"}
                offset: 0
              }
            ) {
              username
              role
            }
          }
        `;

        const result = await graphql(
          schema,
          query,
          {},
          { user: user[i].dataValues }
        );
        if (allowedRole.indexOf(role) > -1) {
          expect(result.data.users[0].username).toBe('superadmin');
        } else {
          expect(result.errors[0].message).toBe('Unauthorized');
        }
      });
    });
  });

  describe('Mutation createUser', () => {
    // eslint-disable-next-line
    roles.map(role => {
      const userByRole = `
        mutation {
          createUser(input: {
            username:"${role}",
            password:"12345",
            firstName:"Gia",
            lastName:"Ho",
            email:"hogia@gmail.com"
          }) {
            username
            password
          }
        }
      `;
      test(`${role} ${
        roleResolver('createUser', role) ? '' : 'not'
      } should allow to create user`, async () => {
        const result = await graphql(schema, userByRole, {}, { role });
        if (roleResolver('createUser', role)) {
          expect(result.createUser).not.toBe(null);
        } else {
          expect(result.errors[0].message).toBe('Unauthorized');
        }
      });
    });
  });

  describe('Mutation editUserById', () => {
    describe('Edit superadmin', () => {
      // eslint-disable-next-line
      roles.map((role, index) => {
        const allowedRole = ['superadmin'];
        test(`Should ${
          allowedRole.indexOf(role) > -1 ? '' : 'not'
        } allow to edit superadmin as ${role}`, async () => {
          const query = `
            mutation {
              editUserById(
                id: "${user[0].id}",
                input: {
                  firstName:"editted",
                }
              ) {
                firstName
              }
            }
          `;
          const result = await graphql(
            schema,
            query,
            {},
            { user: user[index].dataValues }
          );
          if (allowedRole.indexOf(role) > -1) {
            const { firstName } = result.data.editUserById;
            expect(firstName).toBe('editted');
          } else {
            expect(result.errors[0].message).toBe('Unauthorized');
          }
        });
      });
    });

    describe('Edit admin', () => {
      // eslint-disable-next-line
      roles.map((role, index) => {
        const allowedRole = ['superadmin', 'admin'];
        test(`Should ${
          allowedRole.indexOf(role) > -1 ? '' : 'not'
        } allow to edit admin as ${role}`, async () => {
          const query = `
            mutation {
              editUserById(
                id: "${user[1].id}",
                input: {
                  firstName:"editted",
                }
              ) {
                firstName
              }
            }
          `;
          const result = await graphql(
            schema,
            query,
            {},
            { user: user[index].dataValues }
          );
          if (allowedRole.indexOf(role) > -1) {
            const { firstName } = result.data.editUserById;
            expect(firstName).toBe('editted');
          } else {
            expect(result.errors[0].message).toBe('Unauthorized');
          }
        });
      });
    });

    describe('Edit consultant', () => {
      // eslint-disable-next-line
      roles.map((role, index) => {
        const allowedRole = ['superadmin', 'admin', 'consultant'];
        test(`Should ${
          allowedRole.indexOf(role) > -1 ? '' : 'not'
        } allow to edit consultant as ${role}`, async () => {
          const query = `
            mutation {
              editUserById(
                id: "${user[2].id}",
                input: {
                  firstName:"editted",
                }
              ) {
                firstName
              }
            }
          `;
          const result = await graphql(
            schema,
            query,
            {},
            { user: user[index].dataValues }
          );
          if (allowedRole.indexOf(role) > -1) {
            const { firstName } = result.data.editUserById;
            expect(firstName).toBe('editted');
          } else {
            expect(result.errors[0].message).toBe('Unauthorized');
          }
        });
      });
    });
  });
});
