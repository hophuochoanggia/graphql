import { graphql } from 'graphql';
import schema from '../src/graphql';
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

describe('User model', () => {
  test('Should be able to create user', async () => {
    const result = await graphql(
      schema,
      createTesting,
      {},
      { user: {role: 'superadmin' }}
    );
    console.log(result)
    //const { username } = result.data.createUser;
    //expect(username).toBe('testing');
  });
});