import Sequelize from 'sequelize';
import fs from 'fs';
import path from 'path';
import conf from '../config/config.json';

const basename = path.basename(module.filename);
const env = process.env.NODE_ENV || 'test';
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
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// drop db before any run, Jest won't go through this code
if (env === 'development') {
  db.sequelize.sync({ force: true, logging: false }).then(async () => {
    const { user } = db.sequelize.models;
    user.create({
      username: 'hoanggia',
      password: '12345',
      firstName: 'Gia',
      lastName: 'Ho',
      email: 'hoanggia@gmail.com',
      role: 'superadmin',
    });
    user.create({
      username: 'testing',
      password: '12345',
      firstName: 'Gia',
      lastName: 'Ho',
      email: 'hoanggia@gmail.com',
      role: 'consultant',
    });
  });
}
module.exports = db;
