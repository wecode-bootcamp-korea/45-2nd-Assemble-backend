const { EntitySchema } = require('typeorm');

const Reservation = new EntitySchema({
  name: 'Reservation',
  tableName: 'reservation',
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
    reservation_number: {
      type: 'varchar',
      length: 250,
      nullable: false,
    },
    timeslot: {
      type: 'datetime',
      nullable: false,
    },
    host_user_id: {
      type: 'int',
      nullable: false,
    },
    is_match: {
      type: 'boolean',
      nullable: false,
    },
    payment_status: {
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
    courts: {
      type: 'many-to-one',
      target: 'Courts',
      joinColumn: {
        name: 'court_id',
        referenceColumnName: 'id',
      },
    },
    payment: {
      type: 'one-to-many',
      target: 'Payment',
    },
    payment_status: {
      type: 'many-to-one',
      target: 'PaymentStatus',
      joinColumn: {
        name: 'payment_status',
        referenceColumnName: 'id',
      },
    },
    users: {
      type: 'many-to-one',
      target: 'Users',
      joinColumn: {
        name: 'host_user_id',
        referenceColumnName: 'id',
      },
    },
    matches: {
      type: 'one-to-one',
      target: 'Matches',
      joinColumn: {
        name: 'id',
        referenceColumnName: 'reservation_id',
      },
    },
  },
});

module.exports = Reservation;
