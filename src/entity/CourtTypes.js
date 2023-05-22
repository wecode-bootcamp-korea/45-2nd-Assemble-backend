const { EntitySchema } = require('typeorm');

const CourtTypes = new EntitySchema({
  name: 'CourtTypes',
  tableName: 'court_types',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    court_type: {
      type: 'varchar',
      length: 100,
      charset: 'utf8mb4',
      collation: 'utf8mb4_general_ci',
      nullable: false,
    },
    indoor: {
      type: 'boolean',
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

module.exports = CourtTypes;
