module.exports = (sequelize, types) => {
  const Devices_Prgrams = sequelize.define(
    'devices_programs',
    {
      device_program_id: {
        type: types.INTEGER(10).UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
    },
    {
      charset: 'utf8',
      collate: 'utf8_unicode_ci',
    },
  );

  return Devices_Prgrams;
};