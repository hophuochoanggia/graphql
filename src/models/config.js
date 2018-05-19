module.exports = function (sequelize, DataTypes) {
  const config = sequelize.define(
    'config',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(20),
        unique: {
          args: true,
          msg: 'Config already exists'
        }
      },
      setting: {
        type: DataTypes.JSONB,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING(100),
        allowNull: false
      }
    },
    {
      timestamps: true,
      freezeTableName: true
    }
  );
  return config;
};
