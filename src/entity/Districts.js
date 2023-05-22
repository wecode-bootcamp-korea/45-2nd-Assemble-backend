const { EntitySchema } = require('typeorm');

const Districts = new EntitySchema({
  name: 'Districts',
  tableName: 'districts',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    district: {
      type: 'varchar',
      length: 100,
      charset: 'utf8mb4',
      collation: 'utf8mb4_general_ci',
      nullable: false,
    },
    district_image: {
      type: 'varchar',
      length: 400,
      nullable: false,
    },
  },
  relations: {
    courts: {
      type: 'one-to-many',
      target: 'Courts',
    },
  },
});

module.exports = Districts;
