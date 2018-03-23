import { graphql } from "graphql";
import schema from "../../src/graphql";
import models from "../../src/models";

beforeAll(async () => {
  const result = await models.user.create({
    username: "hoanggia",
    password: "12345",
    firstName: "Gia",
    lastName: "Ho",
    email: "hoanggia@gmail.com",
    role: "superadmin"
  });
  id = result.id;
  await models.user.create({
    username: "listTesting",
    password: "12345",
    firstName: "Gia",
    lastName: "Ho",
    email: "hoanggia@gmail.com",
    role: "consultant"
  });
});

afterAll(() => models.sequelize.sync({ force: true, logging: false }));

describe("Event model", () => {
  test("Not null validation", async () => {
    let err;
    try {
      const data = await m.create({});
    } catch (e) {
      err = e.errors;
    }
    expect(err[0].message).toBe("event.type cannot be null");
    expect(err[1].message).toBe("event.patient cannot be null");
    expect(err[2].message).toBe("event.consultant cannot be null");
    expect(err[3].message).toBe("event.referingDoctor cannot be null");
    expect(err[4].message).toBe("event.reportingSpecialist cannot be null");
    expect(err[5].message).toBe("event.data cannot be null");
  });
  test("Should be able to create event", async () => {
    console.log(m.create);
    const data = await m.create({
      type: "a",
      patient: "a",
      consultant: "a",
      referingDoctor: "a",
      reportingSpecialist: "a",
      data: {}
    });
    console.log(data);
    expect(data._options.isNewRecord).toBeTruthy();
  });
});
