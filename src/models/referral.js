module.exports = function (sequelize, DataTypes) {
  const referral = sequelize.define(
    'referral',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('PENDING', 'REJECTED', 'APPROVED'),
        defaultValue: 'PENDING'
      },
      birthday: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      firstName: {
        type: DataTypes.STRING(30),
        allowNull: false
      },
      lastName: {
        type: DataTypes.STRING(30),
        allowNull: false
      },
      mobile: {
        type: DataTypes.STRING(20),
        defaultValue: null
      },
      isMale: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          len: {
            args: [6, 128],
            msg: 'Email address must be between 6 and 128 characters in length'
          },
          isEmail: {
            msg: 'Email address must be valid'
          }
        }
      },
      drivingLicense: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
      dva: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
      dvaType: {
        type: DataTypes.ENUM('GOLD', 'SILVER', 'ORANGE'),
        allowNull: true
      },
      data: {
        type: DataTypes.JSONB,
        allowNull: false
      }
    },
    {
      timestamps: true,
      freezeTableName: true,
      hooks: {
        beforeDelete: instance => {
          if (instance.status !== 'PENDING') {
            throw new Error("Referral can't be deleted");
          }
        }
      }
    }
  );

  referral.associate = ({ user }) => {
    referral.doctor = referral.belongsTo(user, {
      as: 'doctor',
      foreignKey: {
        allowNull: false
      },
      onDelete: 'restrict'
    });
  };

  return referral;
};
