module.exports = (sequelize, types) => {
  const Device = sequelize.define(
    'devices',
    {
      device_id: {
        type: types.INTEGER(10).UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      ip: {
        type: types.STRING(255),
        allowNull: false,
      },

      device_name: {
        type: types.STRING(255),
        allowNull: false,
      },

      url: {
        type: types.STRING(255),
        allowNull: false,
      },

      description: {
        type: types.TEXT,
        allowNull: false,
      },

      status: {
        type: types.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },

      // delay time in miliseconds
      delay_time: {
        type: types.INTEGER,
        allowNull: false,
        defaultValue: 0,
      }
    },
    {
      charset: 'utf8',
      collate: 'utf8_unicode_ci',
    },
  );

  return Device;
};