import validateRole from '../utils/validateRole';

module.exports = function(sequelize, DataTypes) {
  const event = sequelize.define(
    'event', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'completed', 'deleted'),
        defaultValue: 'active'
      },
      prevEventId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'event',
          key: 'id'
        },
        allowNull: true
      },
      data: {
        // default get from eventType metadata
        type: DataTypes.JSONB,
        allowNull: false
      },
      doctorId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'user',
          key: 'id'
        },
        allowNull: false
      },
      reportingSpecialistId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'user',
          key: 'id'
        },
        allowNull: false
      },
      legacy: {
        type: DataTypes.JSONB,
        defaultValue: {}
      }
    }, {
      timestamps: true,
      freezeTableName: true
    }
  );

  event.associate = ({
    user,
    userEvent,
    patient,
    eventType,
    reason
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
