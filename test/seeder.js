export default async models => {
  let data = {};
  // const roles = ['SUPERADMIN', 'ADMIN', 'CONSULTANT', 'DOCTOR', 'SPECIALIST', 'DENTIST'];

  data.users = [];

  data.users[0] = await models.user.create({
    username: 'superadmin',
    password: '12345',
    firstName: 'Gia',
    lastName: 'Ho',
    email: 'hoanggia@gmail.com',
    role: 'SUPERADMIN'
  });

  data.users[1] = await models.user.create({
    username: 'admin',
    password: '12345',
    firstName: 'Gia',
    lastName: 'Ho',
    email: 'hoanggia@gmail.com',
    role: 'ADMIN'
  });

  data.users[2] = await models.user.create({
    username: 'consultant',
    password: '12345',
    firstName: 'Gia',
    lastName: 'Ho',
    email: 'hoanggia@gmail.com',
    role: 'CONSULTANT'
  });

  data.users[3] = await models.user.create({
    username: 'doctor',
    password: '12345',
    firstName: 'Gia',
    lastName: 'Ho',
    email: 'hoanggia@gmail.com',
    role: 'DOCTOR'
  });

  data.users[4] = await models.user.create({
    username: 'specialist',
    password: '12345',
    firstName: 'Gia',
    lastName: 'Ho',
    email: 'hoanggia@gmail.com',
    role: 'SPECIALIST'
  });

  data.users[5] = await models.user.create({
    username: 'dentist',
    password: '12345',
    firstName: 'Gia',
    lastName: 'Ho',
    email: 'hoanggia@gmail.com',
    role: 'DENTIST'
  });

  data.eventType = await models.eventType.create({
    name: 'study',
    description: 'study type',
    metadata: {
      date: 'string'
    }
  });

  data.reason = await models.reason.create({
    description: 'old'
  });

  data.patient = [];
  data.patient[0] = await models.patient.create({
    birthday: new Date(),
    firstName: 'patient',
    lastName: 'patient',
    email: 'hoanggia@gmail.com',
    consultantId: data.users[2].id
  });

  data.patient[1] = await models.patient.create({
    birthday: new Date(),
    firstName: 'patient',
    lastName: 'patient',
    email: 'hoanggia@gmail.com',
    consultantId: data.users[2].id
  });
  data.event = [];
  data.event[0] = await models.event.create({
    typeId: data.eventType.id,
    date: '2018-04-13',
    patientId: data.patient[0].id,
    data: {},
    doctorId: data.users[3].id,
    requestingSpecialistId: data.users[4].id,
    inactiveReasonId: 1
  });

  data.event[1] = await models.event.create({
    typeId: data.eventType.id,
    date: '2018-04-13',
    patientId: data.patient[1].id,
    data: {},
    doctorId: data.users[3].id,
    requestingSpecialistId: data.users[4].id,
    inactiveReasonId: 1
  });

  await data.event[1].addUser(3, { through: { role: 'DOCTOR' } });
  await data.event[1].addUser(4, { through: { role: 'REQUESTING SPECIALIST' } });
  return data;
};
