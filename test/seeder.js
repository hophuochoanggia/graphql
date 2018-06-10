export default async models => {
  let data = {};
  // const roles = ['SUPERADMIN', 'ADMIN', 'CONSULTANT', 'DOCTOR', 'SPECIALIST', 'DENTIST'];

  data.users = [];

  data.users[0] = await models.user.create(
    {
      username: 'superadmin',
      password: '12345',
      firstName: 'Superadmin',
      lastName: 'Ho',
      email: 'hoanggia@gmail.com',
      role: 'SUPERADMIN'
    },
    { returning: false }
  );

  data.users[1] = await models.user.create(
    {
      username: 'admin',
      password: '12345',
      firstName: 'Admin',
      lastName: 'Ho',
      email: 'hoanggia@gmail.com',
      role: 'ADMIN'
    },
    { returning: false }
  );

  data.users[2] = await models.user.create(
    {
      username: 'consultant',
      password: '12345',
      firstName: 'Consultant',
      lastName: 'Ho',
      email: 'hoanggia@gmail.com',
      role: 'CONSULTANT'
    },
    { returning: false }
  );

  data.users[3] = await models.user.create(
    {
      username: 'doctor',
      password: '12345',
      firstName: 'Doctor',
      lastName: 'Ho',
      email: 'hoanggia@gmail.com',
      role: 'DOCTOR'
    },
    { returning: false }
  );

  data.users[4] = await models.user.create(
    {
      username: 'specialist',
      password: '12345',
      firstName: 'Specialist',
      lastName: 'Ho',
      email: 'hoanggia@gmail.com',
      role: 'SPECIALIST'
    },
    { returning: false }
  );

  data.users[5] = await models.user.create(
    {
      username: 'dentist',
      password: '12345',
      firstName: 'Dentist',
      lastName: 'Ho',
      email: 'hoanggia@gmail.com',
      role: 'DENTIST'
    },
    { returning: false }
  );

  data.users[6] = await models.user.create(
    {
      username: 'consultant2',
      password: '12345',
      firstName: 'Gia',
      lastName: 'Ho',
      email: 'hoanggia@gmail.com',
      role: 'CONSULTANT'
    },
    { returning: false }
  );
  // data.eventType = await models.eventType.create(
  //  {
  //    name: "study",
  //    description: "study type",
  //    schema: {
  //      date: "string"
  //    }
  //  },
  //  { returning: false }
  // );

  data.reason = await models.reason.create(
    {
      description: 'old'
    },
    { returning: false }
  );

  data.patient = [];
  data.patient[0] = await models.patient.create(
    {
      birthday: new Date(),
      firstName: 'patient',
      lastName: 'patient',
      email: 'hoanggia@gmail.com',
      drivingLicense: 1
    },
    { returning: false }
  );

  data.patient[1] = await models.patient.create(
    {
      birthday: new Date(),
      firstName: 'patient',
      lastName: 'patient',
      email: 'hoanggia@gmail.com',
      drivingLicense: 2
    },
    { returning: false }
  );
  data.event = [];
  data.event[0] = await models.event.create(
    {
      // typeId: data.eventType.id,
      type: 'STUDY',
      date: '2018-04-13',
      patientId: data.patient[0].id,
      data: {},
      inactiveReasonId: 1,
      consultant: data.users[2].id,
      doctor: data.users[3].id,
      specialist: data.users[4].id
    },
    { returning: false }
  );

  data.event[1] = await models.event.create(
    {
      // typeId: data.eventType.id,
      type: 'CPAP',
      date: '2018-04-13',
      patientId: data.patient[1].id,
      data: {},
      inactiveReasonId: 1,
      consultant: data.users[2].id,
      doctor: data.users[3].id,
      specialist: data.users[4].id
    },
    { returning: false }
  );

  data.referral = await models.referral.create(
    {
      firstName: 'Referral',
      lastName: 'Patient',
      email: 'test@test.com',
      birthday: '1989-12-10',
      data: {
        files: []
      },
      doctorId: 4,
      drivingLicense: 2
    },
    { returning: false }
  );
  return data;
};
