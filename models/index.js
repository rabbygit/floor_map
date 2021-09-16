/**
 * DB configuration
 */

const Sequelize = require("sequelize");
const dbConfig = require("../config/dbConfig");

const { dbName, username, password, host, dialect } = dbConfig;

const sequelize = new Sequelize(dbName, username, password, {
  host,
  dialect,

  query: {
    raw: true,
    logging: false,
  },

  pool: {
    max: 100,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Models
db.devices = require('./devices')(sequelize, Sequelize);
db.programs = require('./programs')(sequelize, Sequelize);
db.contents = require('./contents')(sequelize, Sequelize);
db.contents_urls = require('./contents_urls')(sequelize, Sequelize);
db.devices_programs = require('./devices_programs')(sequelize, Sequelize);

// Associations
db.devices.belongsToMany(db.programs, {
  through: db.devices_programs,
  foreignKey: "device_id",
});

db.programs.belongsToMany(db.devices, {
  through: db.devices_programs,
  foreignKey: "program_id",
});

db.programs.hasMany(db.contents, {
  foreignKey: "program_id",
  onDelete: "CASCADE",
});

db.contents.belongsTo(db.programs, {
  foreignKey: "program_id",
  onDelete: "CASCADE",
});

db.contents.hasMany(db.contents_urls, {
  foreignKey: "content_id",
  onDelete: "CASCADE",
});

db.contents_urls.belongsTo(db.contents, {
  foreignKey: "content_id",
  onDelete: "CASCADE",
});

module.exports = { db };