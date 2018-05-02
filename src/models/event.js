import validateRole from '../utils/validateRole';

module.exports = function (sequelize, DataTypes) {
  const event = sequelize.define(
    'event',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'completed', 'deleted'),
        defaultValue: 'active'
      },
      data: {
        // default get from eventType metadata
        type: DataTypes.JSONB,
        allowNull: false
      },
      legacy: {
        type: DataTypes.JSONB,
        defaultValue: {}
      }
    },
    {
      timestamps: true,
      freezeTableName: true
    }
  );

  event.associate = ({
    user, userEvent, patient, eventType, reason
  }) => {
    event.users = event.belongsToMany(user, {
      through: {
        model: userEvent
      }
    });

    event.type = event.belongsTo(eventType, {
      as: 'type',
      foreignKey: {
        allowNull: false
      },
      onDelete: 'restrict'
    });

    event.reason = event.belongsTo(reason, {
      as: 'inactiveReason',
      foreignKey: {
        allowNull: true
      },
      onUpdate: 'restrict',
      onDelete: 'restrict'
    });

    event.patient = event.belongsTo(patient, {
      foreignKey: {
        allowNull: false
      },
      onDelete: 'restrict'
    });
  };

  return event;
};
