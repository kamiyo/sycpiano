const db = require('./models');

module.exports = () => db.sequelize.sync({ force: false });
