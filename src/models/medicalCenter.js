module.exports = function(sequelize, DataTypes) {
  const medicalCenter = sequelize.define(
    'medicalCenter',
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
      },
      address: {
        type: DataTypes.STRING(50),
        defaultValue: null,
      },
      address2: {
        type: DataTypes.STRING(50),
        defaultValue: null,
      },
      suburb: {
        type: DataTypes.STRING(20),
        defaultValue: null,
      },
      state: {
        type: DataTypes.STRING(10),
        defaultValue: null,
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
        associate: models => {
          medicalCenter.hasMany(models.user, {
            onDelete: 'restrict',
          });
        },
      },
    }
  );
  return medicalCenter;
};
