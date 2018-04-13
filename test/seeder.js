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
    role: 'SUPERADMIN',
  });

  data.users[1] = await models.user.create({
    username: 'admin',
    password: '12345',
    firstName: 'Gia',
    lastName: 'Ho',
    email: 'hoanggia@gmail.com',
    role: 'ADMIN',
  });

  data.users[2] = await models.user.create({
    username: 'consultant',
    password: '12345',
    firstName: 'Gia',
    lastName: 'Ho',
    email: 'hoanggia@gmail.com',
    role: 'CONSULTANT',
  });

  data.users[3] = await models.user.create({
    username: 'doctor',
    password: '12345',
    firstName: 'Gia',
    lastName: 'Ho',
    email: 'hoanggia@gmail.com',
    role: 'DOCTOR',
  });

  data.users[4] = await models.user.create({
    username: 'specialist',
    password: '12345',
    firstName: 'Gia',
    lastName: 'Ho',
    email: 'hoanggia@gmail.com',
    role: 'SPECIALIST',
  });

  data.users[5] = await models.user.create({
    username: 'dentist',
    password: '12345',
    firstName: 'Gia',
    lastName: 'Ho',
    email: 'hoanggia@gmail.com',
    role: 'DENTIST',
  });

  data.eventType = await models.eventType.create({
    name: 'study',
    description: 'study type',
    metadata: {
      date: 'string',
    },
  });
  data.patient = await models.patient.create({
    birthday: new Date(),
    firstName: 'patient',
    lastName: 'patient',
    email: 'hoanggia@gmail.com',
    consultantId: data.users[2].id,
  });

  data.event = await models.event.create({
    typeId: data.eventType.id,
    date: new Date(),
    patientId: data.patient.id,
    data: {},
    doctorId: data.users[3].id,
    requestingSpecialistId: data.users[4].id,
  });

  return data;
};
