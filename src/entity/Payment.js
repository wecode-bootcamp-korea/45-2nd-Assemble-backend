const { EntitySchema } = require('typeorm');

const Payment = new EntitySchema({
  name: 'Payment',
  tableName: 'payment',
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
    user_id: {
      type: 'int',
      nullable: false,
    },
    is_match: {
      type: 'boolean',
      nullable: false,
    },
  },
  relations: {
    reservation: {
      type: 'many-to-one',
      target: 'Reservation',
      joinColumn: {
        name: 'reservation_id',
        referenceColumnName: 'id',
      },
    },
    users: {
      type: 'many-to-one',
      target: 'Users',
      joinColumn: {
        name: 'user_id',
        referenceColumnName: 'id',
      },
    },
  },
});

module.exports = Payment;
