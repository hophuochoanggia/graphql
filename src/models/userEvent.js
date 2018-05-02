module.exports = function (sequelize, DataTypes) {
  const userEvent = sequelize.define(
    'userEvent',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      role: {
        type: DataTypes.STRING
      }
    },
    {
      timestamps: true,
      freezeTableName: true,
      hooks: {
        beforeSave: instance => {
          console.log(instance);
        }
      }
    }
  );
  return userEvent;
};
