import seeder from '../../test/seeder';
import { initTask } from '../../init';

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
  db.sequelize.sync({ force: true, logging: false }).then(async () => {
    const { models } = db.sequelize;
    await seeder(models);
    //await initReferral(models.config);
    await initTask(models.config);
  });
}

module.exports = db;
