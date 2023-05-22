const { EntitySchema } = require('typeorm');

const Parkings = new EntitySchema({
  name: 'Parkings',
  tableName: 'parkings',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    parking: {
      type: 'varchar',
      length: 100,
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

module.exports = Parkings;
