const { EntitySchema } = require('typeorm');

const Timeslot = new EntitySchema({
  name: 'Timeslot',
  tableName: 'timeslot',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    court_id: {
      type: 'int',
      nullable: false,
    },
    timeslot: {
      type: 'datetime',
      nullable: false,
    },
    is_available: {
      type: 'boolean',
      nullable: false,
    },
  },
  relations: {
    courts: {
      type: 'many-to-one',
      target: 'Courts',
      joinColumn: {
        name: 'court_id',
        referenceColumnName: 'id',
      },
    },
  },
});

module.exports = Timeslot;
