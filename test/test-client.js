const { dataSource } = require('../src/models/dataSource');

const truncateTables = async (tables) => {
  await dataSource.query(`SET FOREIGN_KEY_CHECKS=0`);

  for (let table of tables) {
    await dataSource.query(`TRUNCATE table ${table}`);
  }

  await dataSource.query(`SET FOREIGN_KEY_CHECKS=1`);
};

module.exports = { truncateTables };
