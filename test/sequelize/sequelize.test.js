import models from '../src/models';
import seeder from './seeder';
import { comparePwd } from '../src/utils/cryptPassword';

let data;
beforeAll(async () => {
  await models.sequelize.sync({ force: true, logging: false });
  data = await seeder(models);
});
// afterAll(() => );

describe('Sequelize', () => {
  describe('User', () => {
    test('User requires username, password, firstName, lastName', () => {
      models.user.create({}).catch(({ errors }) => {
        expect(errors[0].path).toBe('username');
        expect(errors[1].path).toBe('password');
        expect(errors[2].path).toBe('firstName');
        expect(errors[3].path).toBe('lastName');
        expect(errors[4].path).toBe('email');
      });
    });

    test('Lower case username, firstName, lastName, email | Uppercase role', async () => {
      const {
        username,
        firstName,
        lastName,
        email,
        email2,
        password,
        role
      } = await models.user.create({
        username: 'HOANGGIA',
        password: '12345',
        firstName: 'Gia',
        lastName: 'Ho',
        email: 'TEST@TEST.COM',
        email2: 'TEST@TEST.COM',
        role: 'consultant'
      });
      const compare = await comparePwd('12345', password);
      expect(username).toBe('hoanggia');
      expect(firstName).toBe('gia');
      expect(lastName).toBe('ho');
      expect(email).toBe('test@test.com');
      expect(email2).toBe('test@test.com');
      expect(role).toBe('CONSULTANT');
      expect(compare).toBeTruthy();
    });

    test('No duplicate username', () => {
      models.user
        .create({
          username: 'superadmin',
          password: '12345',
          firstName: 'Gia',
          lastName: 'Ho',
          email: 'TEST@TEST.COM',
          email2: 'TEST@TEST.COM',
          role: 'consultant'
        })
        .catch(({ errors }) => {
          expect(errors[0].message).toBe('User already exist');
        });
    });

    test('Hash password', async () => {
      const { password } = await models.user.find({ where: { username: 'hoanggia' } });
      const compare = await comparePwd('12345', password);
      expect(compare).toBeTruthy();
    });

    test('Able to include patient in user', async () => {
      const { patients } = await models.user.find({
        where: { username: 'consultant' },
        include: models.patient
      });
      expect(patients.length >= 1).toBeTruthy();
    });
  });

  describe('Patient', () => {
    test('Patient requires birthday, fistName, lastName, email, consultantId', () => {
      models.patient.create({}).catch(({ errors }) => {
        expect(errors[0].path).toBe('birthday');
        expect(errors[1].path).toBe('firstName');
        expect(errors[2].path).toBe('lastName');
        expect(errors[3].path).toBe('email');
        expect(errors[4].path).toBe('consultantId');
      });
    });

    test('Lower case firstName, lastName, email', async () => {
      const { firstName, lastName, email } = await models.patient.create({
        birthday: new Date(),
        firstName: 'TEST',
        lastName: 'TEST',
        email: 'TEST@TEST.COM',
        consultantId: data.users[2].id
      });
      expect(firstName).toBe('test');
      expect(lastName).toBe('test');
      expect(email).toBe('test@test.com');
    });

    test('Able to include consultant in patient', async () => {
      const { consultant } = await models.patient.find({
        where: { firstName: 'patient' },
        include: { model: models.user, as: 'consultant' }
      });
      expect(consultant).not.toBeNull();
    });

    test('Assign user with wrong role', () => {
      models.patient
        .create({
          firstName: 'patient',
          lastName: 'patient',
          birthday: '2007-12-03',
          email: 'hoanggia@gmail.com',
          consultantId: 2
        })
        .catch(({ errors }) => {
          expect(errors[0].message).toBe('User is not a CONSULTANT');
        });
    });

    test('Test create patient', () => {
      models.patient
        .create({
          firstName: 'patient',
          lastName: 'patient',
          birthday: '2007-12-03',
          email: 'hoanggia@gmail.com',
          consultantId: 3
        })
        .then(instance => {
          expect(instance).toBeDefined();
        });
    });
  });

  describe('EventType', () => {
    test('EventType required name, metadata, description', async () => {
      models.eventType.create({}).catch(({ errors }) => {
        expect(errors[0].path).toBe('name');
        expect(errors[1].path).toBe('metadata');
        expect(errors[2].path).toBe('description');
      });
    });

    test('Upper case name', async () => {
      models.eventType
        .create({
          name: 'test',
          metadata: {},
          description: 'study'
        })
        .catch(({ name }) => {
          expect(name).toBe('test');
        });
    });
  });

  describe('Event', () => {
    test('Event required type, date, patient, data', async () => {
      models.event.create({}).catch(({ errors }) => {
        expect(errors[0].path).toBe('date');
        expect(errors[1].path).toBe('data');
        expect(errors[2].path).toBe('doctorId');
        expect(errors[3].path).toBe('requestingSpecialistId');
        expect(errors[4].path).toBe('typeId');
        expect(errors[5].path).toBe('patientId');
      });
    });
    test('Create event and set user transaction', async () => {
      let t;
      try {
        await models.sequelize.transaction(async transaction => {
          t = transaction;
          const event = await models.event.create(
            {
              typeId: data.eventType.id,
              date: new Date(),
              patientId: 1,
              data: {},
              doctorId: data.users[3].id,
              requestingSpecialistId: data.users[4].id
            },
            transaction
          );
          await event.addUser(event.doctorId, { through: { role: 'DOCTOR' }, transaction });
          return event.addUser(event.reportingSpecialistId, {
            through: { role: 'REQUESTING SPECIALIST' },
            transaction
          });
        });
      } catch (error) {
        // eslint-disable-next-line
        console.log(error);
      }
      const doctor = await models.user.findById(4);
      const e = await doctor.getEvents({ through: { where: { role: 'DOCTOR' } } });
      expect(t.finished).toBe('commit');
    });
  });
});
