module.exports = function (sequelize, DataTypes) {
  const eventType = sequelize.define(
    'eventType',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
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
      hooks: {
        beforeSave: instance => {
          instance.name = instance.name.toUpperCase();
        },
      },
    },
  );
  eventType.associate = ({ event }) => {
    eventType.events = eventType.hasMany(event, {
      foreignKey: {
        fieldName: 'typeId',
        allowNull: false,
      },
      onDelete: 'restrict',
    });
  };
  return eventType;
};
