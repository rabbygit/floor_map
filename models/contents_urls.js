module.exports = (sequelize, types) => {
  const ContentUrl = sequelize.define(
    'contents_urls',
    {
      content_url_id: {
        type: types.INTEGER(10).UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      content_type: {
        type: types.ENUM('image', 'video'),
        allowNull: false,
        defaultValue: 'image',
      },

      url: {
        type: types.TEXT,
        allowNull: false,
      },

      delay_time: {
        type: types.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      charset: 'utf8',
      collate: 'utf8_unicode_ci',
    },
  );

  return ContentUrl;
};