import { cryptPwd } from "../utils/cryptPassword";

module.exports = function(sequelize, DataTypes) {
  const patient = sequelize.define(
    "patient",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        unique: true
      },
      consultant: {
        type: DataTypes.UUID,
        allowNull: false
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
      address: {
        type: DataTypes.STRING(50),
        defaultValue: null
      },
      address2: {
        type: DataTypes.STRING(50),
        defaultValue: null
      },
      suburb: {
        type: DataTypes.STRING(20),
        defaultValue: null
      },
      state: {
        type: DataTypes.STRING(10),
        defaultValue: null
      },
      avatarUrl: {
        type: DataTypes.STRING,
        defaultValue: null // set to default avatar
      },
      isMale: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      workPhone: {
        type: DataTypes.STRING(20),
        defaultValue: null
      },
      homePhone: {
        type: DataTypes.STRING(20),
        defaultValue: null
      },
      mobile: {
        type: DataTypes.STRING(20),
        defaultValue: null
      },
      fax: {
        type: DataTypes.STRING(20),
        defaultValue: null
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          len: {
            args: [6, 128],
            msg: "Email address must be between 6 and 128 characters in length"
          },
          isEmail: {
            msg: "Email address must be valid"
          }
        }
      },
      medicare: {
        type: DataTypes.STRING(20),
        allowNull: true
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
        type: DataTypes.ENUM("gold", "silver", "orange"),
        defaultValue: "orange"
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
  return patient;
};
