const Config = function () {
  switch (process.env.NODE_ENV) {
    case 'production':
      return {
        username: 'root',
        dbName: 'floor_map',
        password: '',
        host: 'localhost',
        dialect: 'mysql',
      };

    default:
      return {
        username: 'root',
        dbName: 'floor_map',
        password: '',
        host: 'localhost',
        dialect: 'mysql',
      };
  }
};

module.exports = Config();