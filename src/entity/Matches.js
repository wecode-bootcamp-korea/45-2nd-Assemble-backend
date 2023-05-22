const { EntitySchema } = require('typeorm');

const Matches = new EntitySchema({
  name: 'Matches',
  tableName: 'matches',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    reservation_id: {
      type: 'int',
      nullable: false,
    },
    guest_user_id: {
      type: 'int',
      nullable: true,
    },
    match_status_id: {
      type: 'int',
      nullable: false,
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
    match_status: {
      type: 'many-to-one',
      target: 'MatchStatus',
      joinColumn: {
        name: 'match_status_id',
        referenceColumnName: 'id',
      },
    },
    users: {
      type: 'many-to-one',
      target: 'users',
      joinColumn: {
        name: 'guest_user_id',
        referenceColumnName: 'id',
      },
    },
    reservation: {
      type: 'one-to-one',
      target: 'Reservation',
      joinColumn: {
        name: 'reservation_id',
        referenceColumnName: 'id',
      },
    },
  },
});

module.exports = Matches;
