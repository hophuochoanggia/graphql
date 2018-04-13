module.exports = function (sequelize, DataTypes) {
  const reason = sequelize.define(
    'reason',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
      classMethods: {
        associate: models => {
          reason.hasMany(models.event, {
            onDelete: 'restrict',
          });
        },
      },
    },
  );
  return reason;
};
