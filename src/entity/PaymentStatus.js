const { EntitySchema } = require('typeorm');

const PaymentStatus = new EntitySchema({
  name: 'PaymentStatus',
  tableName: 'payment_status',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    status: {
      type: 'varchar',
      length: 100,
      nullable: false,
    },
  },
  relations: {
    reservation: {
      type: 'one-to-many',
      target: 'Reservation',
    },
  },
});

module.exports = PaymentStatus;
