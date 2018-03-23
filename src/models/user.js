import { cryptPwd } from "../utils/cryptPassword";
module.exports = function(sequelize, DataTypes) {
  const user = sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        unique: true
      },
      username: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: {
          args: true,
          msg: "User already exist"
        },
        validate: {
          len: {
            args: [4, 30],
            msg: "User name is not in range 4-30"
          }
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: 5,
            msg: "User password must be atleast 5 characters in length"
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
      medicalCenter: {
        type: DataTypes.UUID,
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
      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      email2: {
        type: DataTypes.STRING(50),
        defaultValue: null,
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
      isEmail2Verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      providerNo: {
        type: DataTypes.STRING(20),
        defaultValue: null
      },
      role: {
        type: DataTypes.ENUM(
          "superadmin",
          "admin",
          "consultant",
          "doctor",
          "specialist",
          "dentist"
        ),
        defaultValue: "consultant"
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
        beforeSave: (user, options) => {
          user.username = user.username.toLowerCase();
          return cryptPwd(user.password)
            .then(success => {
              user.password = success;
            })
            .catch(err => {
              if (err) console.log(err);
            });
        }
      },
      classMethods: {
        associate: models => {
          user.belongsTo(models.mdeicalCenter, {
            as: "medicalCenter",
            onDelete: "restrict"
          });
        }
      }
    }
  );

  return user;
};
