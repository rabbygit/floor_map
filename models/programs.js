module.exports = (sequelize, types) => {
  const Program = sequelize.define(
    'programs',
    {
      program_id: {
        type: types.INTEGER(10).UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      program_name: {
        type: types.STRING(255),
        allowNull: false,
      },

      publish_date: {
        type: types.DATE,
        defaultValue: sequelize.NOW
      },

      layout: {
        type: types.ENUM('layout1', 'layout2', 'layout3'),
        allowNull: false,
        defaultValue: 'layout1',
      },

      marquee: {
        type: types.TEXT,
        defaultValue: "",
      },

      notice: {
        type: types.TEXT,
        defaultValue: "",
      }
    },
    {
      charset: 'utf8',
      collate: 'utf8_unicode_ci',
    },
  );

  return Program;
};