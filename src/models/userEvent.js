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
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      timestamps: true,
      freezeTableName: true,
      indexes: [
        {
          unique: true,
          fields: ['role', 'eventId']
        }
      ]
    }
  );
  return userEvent;
};
