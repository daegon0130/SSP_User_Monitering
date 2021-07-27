const Sequelize = require('sequelize');
const User = require('./usr_user');
const UserLog = require('./user_log');
const TimeLog = require('./time_log');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);
db.sequelize = sequelize;
db.User = User;
db.UserLog = UserLog;
db.TimeLog = TimeLog;

User.init(sequelize);
UserLog.init(sequelize);
TimeLog.init(sequelize);

User.associate(db);
UserLog.associate(db);
TimeLog.associate(db);

module.exports = db;