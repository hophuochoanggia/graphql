module.exports = function (sequelize, DataTypes) {
  const eventType = sequelize.define(
    'userEvent',
    {
      role: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
    },
  );
  return eventType;
};
