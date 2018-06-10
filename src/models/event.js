const roles = ['consultant', 'doctor', 'specialist', 'dentist', 'scientist'];

module.exports = function (sequelize, DataTypes) {
  const { Promise } = sequelize;
  const event = sequelize.define(
    'event',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      isActive: {
        type: DataTypes.ENUM('inactive', 'active', 'deleted'),
        defaultValue: 'active'
      },
      status: {
        type: DataTypes.ENUM('pending', 'accepted', 'completed'),
        defaultValue: 'pending'
      },
      type: {
        type: DataTypes.ENUM('STUDY', 'CPAP'),
        allowNull: false
      },
      data: {
        type: DataTypes.JSONB,
        allowNull: false
      },
      legacy: {
        type: DataTypes.JSONB,
        defaultValue: {}
      },
      consultant: {
        type: DataTypes.VIRTUAL,
        allowNull: false
      },
      doctor: {
        type: DataTypes.VIRTUAL,
        allowNull: false
      },
      specialist: {
        type: DataTypes.VIRTUAL,
        allowNull: false
      },
      dentist: {
        type: DataTypes.VIRTUAL,
        allowNull: true
      },
      scientist: {
        type: DataTypes.VIRTUAL,
        allowNull: true
      }
    },
    {
      timestamps: true,
      freezeTableName: true,
      hooks: {
        afterSave: (instance, { transaction }) => {
          const updatePromiseArray = [];
          roles.map(role => {
            if (instance[role]) {
              return updatePromiseArray.push(instance.setUser(instance[role], role.toUpperCase(), transaction));
            }
          });
          return Promise.all(updatePromiseArray);
        }
      }
    }
  );

  event.prototype.setUser = function (id, role, transaction) {
    const { user, userEvent } = sequelize.models;
    return Promise.all([
      user.findById(id, { transaction }),
      userEvent.findOrBuild({
        where: {
          eventId: this.id,
          role
        },
        transaction
      })
    ]).spread((uInstance, [throughInstance]) => {
      if (uInstance.role !== role) {
        throw new Error(`The user is not a ${role}`);
      }
      throughInstance.userId = uInstance.id;
      throughInstance.save();
    });
  };

  event.associate = ({
    user, userEvent, patient, reason
  }) => {
    event.users = event.belongsToMany(user, {
      through: {
        model: userEvent
      }
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
