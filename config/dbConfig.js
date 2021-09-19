const Config = function () {
  switch (process.env.NODE_ENV) {
    case 'dev':
      return {
        username: 'root',
        dbName: 'floor_map',
        password: '',
        host: 'localhost',
        dialect: 'mysql',
      };

    default:
      return {
        username: 'picktask',
        dbName: 'floor_map',
        password: 'e!1btl[3J8$KCm/o',
        host: '174.138.27.189',
        dialect: 'mysql',
      };
  }
};

module.exports = Config();