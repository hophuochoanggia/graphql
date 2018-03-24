module.exports = function (sequelize, DataTypes) {
  const eventType = sequelize.define(
    'eventType',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
      classMethods: {
        associate: (models) => {
          eventType.hasMany(models.event, {
            onDelete: 'restrict',
          });
        },
      },
    },
  );
  return eventType;
};
