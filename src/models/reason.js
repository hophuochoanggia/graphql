module.exports = function(sequelize, DataTypes) {
  const reason = sequelize.define(
    "reason",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
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
            onDelete: "restrict",
          });
        },
      },
    }
  );
  return reason;
};
