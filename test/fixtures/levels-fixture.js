const { dataSource } = require('../../src/models/dataSource');

const createLevels = () => {
  return dataSource.query(
    `
    INSERT INTO levels (
        level
    ) VALUES (?), (?), (?)
  `,
    [1, 2, 3]
  );
};

module.exports = { createLevels };
