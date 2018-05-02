const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const conf = require('../config/config.json');

const basename = path.basename(module.filename);
const env = process.env.NODE_ENV || 'dev';
const config = conf[env];
const db = {};
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;
if (env === 'dev') {
  db.sequelize.sync({ force: true, logging: false }).then(() => {
    const { eventType, user, patient } = db.sequelize.models;
    eventType.create({
      name: 'study',
      description: 'study',
      metadata: []
    });
    user.create({
      username: 'test',
      password: '12345',
      firstName: 'test',
      lastName: 'test',
      email: 'hoanggia@gmail.com',
      role: 'superadmin',
      address: '6233 Australia',
      workPhone: '123456'
    });
    user.create({
      username: 'consultant2',
      password: '12345',
      firstName: 'test',
      lastName: 'test',
      email: 'hoanggia@gmail.com',
      role: 'consultant',
      address: '6233 Australia',
      workPhone: '123456'
    });
    user
      .create({
        username: 'superadmin',
        password: '12345',
        firstName: 'superadmin',
        lastName: 'Ho',
        email: 'hoanggia@gmail.com',
        role: 'superadmin',
        address: '6233 Australia',
        workPhone: '123456'
      })
      .then(() => {
        user
          .create({
            username: 'consultant',
            password: '12345',
            firstName: 'consultant',
            lastName: 'Ho',
            email: 'hoanggia@gmail.com',
            role: 'consultant',
            address: '6233 Australia',
            workPhone: '123456'
          })
          .then(() => {
            patient.create({
              firstName: 'Patient1',
              lastName: 'Ho',
              email: 'hoanggia@gmail.com',
              birthday: new Date()
            });
            patient.create({
              firstName: 'Patient2',
              lastName: 'Ho',
              email: 'hoanggia@gmail.com',
              birthday: new Date()
            });
          });
      });
  });
}

module.exports = db;
