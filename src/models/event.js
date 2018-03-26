module.exports = function(sequelize, DataTypes) {
  const event = sequelize.define(
    'event',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
      },
      type: {
        type: DataTypes.UUID, // type table
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      patient: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'completed', 'deleted'),
        defaultValue: 'active',
      },
      inactiveReason: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      consultant: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      referingDoctor: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      requestingSpecialist: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      reportingSpecialist: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      dentist: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      prevEvent: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      data: {
        // default get from eventType metadata
        type: DataTypes.JSONB,
        allowNull: false,
      },
      legacy: {
        type: DataTypes.JSONB,
        defaultValue: {},
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
      classMethods: {
        associate: models => {
          event.belongsTo(models.user, {
            as: 'consultant',
            onDelete: 'restrict',
          });
          event.belongsTo(models.user, {
            as: 'referringDoctor',
            onDelete: 'restrict',
          });
          event.belongsTo(models.user, {
            as: 'requestingSpecialist',
            onDelete: 'restrict',
          });
          event.belongsTo(models.user, {
            as: 'reportingSpecialist',
            onDelete: 'restrict',
          });
          event.belongsTo(models.user, {
            as: 'dentist',
            onDelete: 'restrict',
          });

          event.belongsTo(models.eventType, {
            as: 'type',
            onDelete: 'restrict',
          });
          event.belongsTo(models.reason, {
            as: 'reason',
            onDelete: 'cascade',
          });
        },
      },
    }
  );
  return event;
};
