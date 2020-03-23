import Sequelize from 'sequelize';

import User from '../app/models/User';
import Recipients from '../app/models/Recipients';
import Deliverymans from '../app/models/Deliverymans';
import File from '../app/models/File';
import Orders from '../app/models/Orders';

import databaseConfig from '../config/database';

const models = [User, Recipients, Deliverymans, File, Orders];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection));
    models.map(
      model => model.associate && model.associate(this.connection.models)
    );
  }
}

export default new Database();
