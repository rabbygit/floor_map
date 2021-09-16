module.exports = (sequelize, types) => {
  const Content = sequelize.define(
    'contents',
    {
      content_id: {
        type: types.INTEGER(10).UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      content_type: {
        type: types.ENUM('image', 'video', 'pptx'),
        allowNull: false,
        defaultValue: 'image',
      },

      text: {
        type: types.TEXT,
      },
    },
    {
      charset: 'utf8',
      collate: 'utf8_unicode_ci',
    },
  );

  return Content;
};