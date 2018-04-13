import { graphql } from 'graphql';
import { lensPath, view } from 'ramda';
import schema from '../src/graphql';
import models from '../src/models';
import { roles } from '../src/utils/resolverWithRole';

const lensCreate = lensPath(['data', 'createEventType']);
const lensEdit = lensPath(['data', 'editEventTypeById']);
const lensError = lensPath(['errors', 0]);

let eventType = [];
beforeAll(async () => {
  eventType = await models.eventType.bulkCreate([
    {
      name: 'study',
      description: 'study type',
      metadata: {
        date: 'string',
      },
    },
    {
      name: 'cpap',
      description: 'study type',
      metadata: {
        date: 'string',
      },
    },
  ]);
});

const createEventType = `
  mutation {
    createEvent(input: {
      name:"test",
      description:"test",
      metadata:{}
    }) {
      id
      name
      description
    }
  }
`;

const fieldValidation = `
  mutation {
    createEvent(input: {
      name:null,
      description:null,
      metadata:null
    }) {
      id
      name
      description
    }
  }
`;

afterAll(() => models.sequelize.sync({ force: true, logging: false }));

describe('Event type model', () => {
  test('Field input validation', async () => {
    const result = await graphql(schema, fieldValidation, {}, { user: { role: 'superadmin' } });
    const { message } = view(lensError, result);
    expect(message).toBeDefined();
  });

  test('Should allow to create event type', async () => {
    const result = await graphql(schema, createEventType, {}, { user: { role: 'superadmin' } });
    const { id } = view(lensCreate, result);
    expect(id).toBeDefined();
  });

  test('Should deny same event type name', async () => {
    const result = await graphql(schema, createEventType, {}, { user: { role: 'superadmin' } });
    const { message } = view(lensError, result);
    expect(message).toBeDefined();
  });
});

describe('Event type ACL', () => {
  describe('Query eventType', () => {
    const allowedRole = ['superadmin', 'admin', 'consultant'];
    // eslint-disable-next-line
    roles.map(role => {
      test(`Should ${
        allowedRole.indexOf(role) > -1 ? '' : 'not'
      } allow to fetch event type as ${role}`, async () => {
        const query = `
          query {
            event(id: "${eventType[0].id}") {
              id
              name
              description
            }
          }
        `;

        const result = await graphql(schema, query, {}, { user: { role } });
        if (allowedRole.indexOf(role) > -1) {
          const { id } = result.data.eventType;
          expect(id).toBeDefined();
        } else {
          const { message } = view(lensError, result);
          expect(message).toBe('Unauthorized');
        }
      });
    });
  });

  describe('Query eventTypes', () => {
    const allowedRole = ['superadmin', 'admin', 'consultant'];
    // eslint-disable-next-line
    roles.map(role => {
      test(`Should ${
        allowedRole.indexOf(role) > -1 ? '' : 'not'
      } allow to fetch event type as ${role}`, async () => {
        const query = `
          query {
            events(
              input: {
                where: {}
                offset: 0
              }
            ){
              id
              name
              description
            }
          }
        `;

        const result = await graphql(schema, query, {}, { user: { role } });
        if (allowedRole.indexOf(role) > -1) {
          const { id } = result.data.eventTypes[0];
          expect(id).toBeDefined();
        } else {
          const { message } = view(lensError, result);
          expect(message).toBe('Unauthorized');
        }
      });
    });
  });

  describe('Mutation createEventType', () => {
    const allowedRole = ['superadmin'];
    // eslint-disable-next-line
    roles.map(role => {
      test(`Should ${
        allowedRole.indexOf(role) > -1 ? '' : 'not'
      } allow event type creation as ${role}`, async () => {
        const sampleEventType = `
          mutation {
            createEventType(input: {
              name:"${Math.random()}",
              description:"test",
              metadata:{}
            }) {
              id
              name
              description
            }
          }
        `;

        const result = await graphql(schema, sampleEventType, {}, { user: { role } });
        if (allowedRole.indexOf(role) > -1) {
          const { id } = view(lensCreate, result);
          expect(id).toBeDefined();
        } else {
          const { message } = view(lensError, result);
          expect(message).toBe('Unauthorized');
        }
      });
    });
  });

  describe('Mutation editEventType', () => {
    const allowedRole = ['superadmin'];
    // eslint-disable-next-line
    roles.map(role => {
      test(`Should ${
        allowedRole.indexOf(role) > -1 ? '' : 'not'
      } allow event type edition as ${role}`, async () => {
        const query = `
            mutation {
              editEventTypeById(
                id: "${eventType[0].id}",
                input: {
                  description:"${role}",
                }
              ) {
                name,
                description
              }
            }
          `;
        const result = await graphql(schema, query, {}, { user: { role } });
        if (allowedRole.indexOf(role) > -1) {
          const { description } = view(lensEdit, result);
          expect(description).toBe(role);
        } else {
          const { message } = view(lensError, result);
          expect(message).toBe('Unauthorized');
        }
      });
    });
  });
});
