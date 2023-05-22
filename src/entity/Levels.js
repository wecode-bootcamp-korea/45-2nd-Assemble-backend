const { EntitySchema } = require('typeorm');

const Levels = new EntitySchema({
  name: 'Levels',
  tableName: 'levels',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    level: {
      type: 'int',
      nullable: false,
    },
  },
  relations: {
    users: {
      type: 'one-to-many',
      target: 'Users',
    },
  },
});

module.exports = Levels;
