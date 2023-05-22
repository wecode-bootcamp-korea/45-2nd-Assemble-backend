const { EntitySchema } = require('typeorm');

const Users = new EntitySchema({
  name: 'Users',
  tableName: 'users',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    kakao_id: {
      type: 'bigint',
      nullable: false,
    },
    name: {
      type: 'varchar',
      length: 100,
      nullable: true,
    },
    gender: {
      type: 'varchar',
      length: 50,
      nullable: true,
    },
    level_id: {
      type: 'int',
      nullable: true,
    },
    createdAt: {
      type: 'timestamp',
      name: 'created_at',
      nullable: false,
      default: () => 'CURRENT_TIMESTAMP',
    },
    updatedAt: {
      type: 'timestamp',
      updateDate: true,
      nullable: true,
      default: null,
    },
  },
  relations: {
    courts: {
      type: 'one-to-many',
      target: 'Courts',
    },
    levels: {
      type: 'many-to-one',
      target: 'Levels',
      joinColumn: {
        name: 'level_id',
        referenceColumnName: 'id',
      },
    },
    matches: {
      type: 'one-to-many',
      target: 'Matches',
    },
    reservation: {
      type: 'one-to-many',
      target: 'Reservation',
    },
    payment: {
      type: 'one-to-many',
      target: 'Payment',
    },
  },
});

module.exports = Users;
