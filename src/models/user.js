import { randomBytes } from 'crypto';
import { cryptPwd } from '../utils/cryptPassword';
import capitalize from '../utils/capitalize';

const env = process.env.NODE_ENV || 'dev';
const generatePwd = () => {
  const buffer = randomBytes(8);
  const base64 = buffer.toString('base64');
  return base64.slice(0, -1);
};

module.exports = function (sequelize, DataTypes) {
  const user = sequelize.define(
    'user',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      username: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: {
          args: true,
          msg: 'User already exist'
        },
        validate: {
          len: {
            args: [4, 30],
            msg: 'User name is not in range 4-30'
          }
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: {
            args: 5,
            msg: 'User password must be atleast 5 characters in length'
          }
        }
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
            msg: 'Email address must be between 6 and 128 characters in length'
          },
          isEmail: {
            msg: 'Email address must be valid'
          }
        }
      },
      email2: {
        type: DataTypes.STRING(50),
        defaultValue: null,
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
      providerNo: {
        type: DataTypes.STRING(20),
        defaultValue: null
      },
      role: {
        type: DataTypes.ENUM(
          'SUPERADMIN',
          'ADMIN',
          'CONSULTANT',
          'DOCTOR',
          'SPECIALIST',
          'DENTIST'
        ),
        defaultValue: 'CONSULTANT'
      },
      legacy: {
        type: DataTypes.JSONB,
        defaultValue: {}
      }
    },
    {
      timestamps: true,
      freezeTableName: true,
      hooks: {
        beforeCreate: instance => {
          if (env === 'prod') {
            instance.password = generatePwd();
          } else {
            instance.password = '12345';
          }
          return cryptPwd(instance.password).then(success => {
            instance.password = success;
          });
        },
        beforeSave: instance => {
          instance.username = instance.username.toLowerCase();
          instance.firstName = capitalize(instance.firstName);
          instance.lastName = capitalize(instance.lastName);
          instance.email = instance.email.toLowerCase();
          instance.email2 = instance.email2 ? instance.email2.toLowerCase() : null;
          instance.role = instance.role.toUpperCase();
        }
      }
    }
  );

  user.prototype.generatePwd = async function () {
    const password = generatePwd();
    try {
      const hash = await cryptPwd(password);
      return this.update({ password: hash });
    } catch (e) {
      throw e;
    }
  };

  user.prototype.setPwd = async function (password) {
    try {
      const hash = await cryptPwd(password);
      return this.update({ password: hash });
    } catch (e) {
      throw e;
    }
  };

  user.associate = ({ event, patient, userEvent }) => {
    user.patients = user.hasMany(patient, {
      foreignKey: {
        fieldName: 'consultantId',
        allowNull: false
      },
      onDelete: 'restrict'
    });

    user.events = user.belongsToMany(event, { through: { model: userEvent } });
  };
  return user;
};
