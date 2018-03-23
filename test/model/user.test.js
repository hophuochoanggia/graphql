import { graphql } from "graphql";
import { lensPath, view } from "ramda";
import schema from "../../src/graphql";
import models from "../../src/models";
import { comparePwd } from "../../src/utils/cryptPassword";
import {
  roleResolver,
  resolverWithRole
} from "../../src/utils/resolverWithRole";

const lensCreate = lensPath(["data", "createUser"]);
const lensError = lensPath(["errors", 0]);
const createTesting = `
  mutation {
    createUser(user: {
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
    createUser(user: {
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
    createUser(user: {
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
    createUser(user: {
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

const roles = [
  "superadmin",
  "admin",
  "consultant",
  "doctor",
  "specialist",
  "dentist"
];
let user = {};
beforeAll(async () => {
  user = await models.user.bulkCreate([
    {
      username: "superadmin",
      password: "12345",
      firstName: "Gia",
      lastName: "Ho",
      email: "hoanggia@gmail.com",
      role: "superadmin"
    },
    {
      username: "admin",
      password: "12345",
      firstName: "Gia",
      lastName: "Ho",
      email: "hoanggia@gmail.com",
      role: "admin"
    },
    {
      username: "consultant",
      password: "12345",
      firstName: "Gia",
      lastName: "Ho",
      email: "hoanggia@gmail.com",
      role: "consultant"
    },
    {
      username: "doctor",
      password: "12345",
      firstName: "Gia",
      lastName: "Ho",
      email: "hoanggia@gmail.com",
      role: "doctor"
    },
    {
      username: "specialist",
      password: "12345",
      firstName: "Gia",
      lastName: "Ho",
      email: "hoanggia@gmail.com",
      role: "specialist"
    },
    {
      username: "dentist",
      password: "12345",
      firstName: "Gia",
      lastName: "Ho",
      email: "hoanggia@gmail.com",
      role: "dentist"
    }
  ]);
});

afterAll(() => models.sequelize.sync({ force: true, logging: false }));

describe("User model", () => {
  test("Should be able to create user", async () => {
    const result = await graphql(
      schema,
      createTesting,
      {},
      { role: "superadmin" }
    );
    const { username } = view(lensCreate, result);
    expect(username).toBe("testing");
  });
  test("Should not be able to create duplicate user", async () => {
    const result = await graphql(schema, createTesting);
    expect(result.errors).not.toBe(undefined);
  });
  test("Upper case username is the same as lower case", async () => {
    const result = await graphql(
      schema,
      createTESTING,
      {},
      { role: "superadmin" }
    );
    const { message } = view(lensError, result);
    expect(message).toBe("User already exist");
  });
  test("Password should be hash", async () => {
    const result = await graphql(
      schema,
      passwordHash,
      {},
      { role: "superadmin" }
    );
    const { password } = view(lensCreate, result);
    const compare = await comparePwd("12345", password);
    expect(password).not.toBe("12345");
    expect(compare).toBeTruthy();
  });
  test("Should has field validate error", async () => {
    const result = await graphql(
      schema,
      fieldValidation,
      {},
      { role: "admin" }
    );
    const { message } = result.errors[0];
    const error = message.split("\n");
    expect(error[0]).toBe("Validation error: User name is not in range 4-30,");
    expect(error[1]).toBe(
      "Validation error: User password must be atleast 5 characters in length"
    );
  });
});
describe("User ACL", () => {
  describe("query user", () => {
    roles.map((role, i) => {
      test(`Should ${
        ["superadmin", "admin", "consultant"].indexOf(role) > -1 ? "" : "not"
      } allow to fetch consultant as ${role}/owner`, async () => {
        const query = `
          {
            user(
              targetId: "${user[2].id}"
            ) {
              username
            }
          }
        `;
        const result = await graphql(
          schema,
          query,
          {},
          { id: user[i].id, role }
        );
        if (["superadmin", "admin", "consultant"].indexOf(role) > -1) {
          const { username } = result.data.user;
          expect(username).toBe("consultant");
        } else {
          expect(result.errors[0].message).toBe("Unauthorized");
        }
      });
    });
  });

  describe("query users", () => {
    test("Should allow to fetch list user with token", async () => {
      const query = `
        {
          users(
            params: {
              username:"admin"
            }
          ) {
            username
            role
          }
        }
      `;
      const result = await graphql(schema, query, {}, { id: user[0].id });
      expect(result.data.users[0].username).toBe("superadmin");
    });
  });

  describe("mutation createUser", () => {
    roles.map(role => {
      const userByRole = `
        mutation {
          createUser(user: {
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
        roleResolver("createUser", role) ? "" : "not"
      } should allow to create user`, async () => {
        const result = await graphql(schema, userByRole, {}, { role });
        if (roleResolver("createUser", role)) {
          expect(result.createUser).not.toBe(null);
        } else {
          expect(result.errors[0].message).toBe("Unauthorized");
        }
      });
    });
  });
});
