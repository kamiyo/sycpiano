import db from './models/index';

export default () => db.sequelizer.sync({ force: false });
