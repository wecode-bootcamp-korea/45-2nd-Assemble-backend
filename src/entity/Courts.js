const { EntitySchema } = require('typeorm');

const Courts = new EntitySchema({
  name: 'Courts',
  tableName: 'courts',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    address: {
      type: 'varchar',
      length: 400,
      charset: 'utf8mb4',
      collation: 'utf8mb4_general_ci',
      nullable: false,
      unique: true,
    },
    price: {
      type: 'decimal',
      precision: 12,
      scale: 2,
      nullable: false,
      default: 0.0,
    },
    parking_id: {
      type: 'int',
      nullable: false,
    },
    rental_equip: {
      type: 'boolean',
      nullable: false,
    },
    shower_facility: {
      type: 'boolean',
      nullable: false,
    },
    amenities: {
      type: 'boolean',
      nullable: false,
    },
    district_id: {
      type: 'int',
      nullable: false,
    },
    court_image: {
      type: 'varchar',
      length: 400,
      nullable: false,
    },
    court_type_id: {
      type: 'int',
      nullable: false,
    },
    owner_id: {
      type: 'int',
      nullable: false,
    },
    description: {
      type: 'varchar',
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
    court_type: {
      type: 'many-to-one',
      target: 'CourtTypes',
      joinColumn: {
        name: 'court_type_id',
        referenceColumnName: 'id',
      },
    },
    parkings: {
      type: 'many-to-one',
      target: 'Parkings',
      joinColumn: {
        name: 'parking_id',
        referenceColumnName: 'id',
      },
    },
    districts: {
      type: 'many-to-one',
      target: 'Districts',
      joinColumn: {
        name: 'district_id',
        referenceColumnName: 'id',
      },
    },
    timeslot: {
      type: 'one-to-many',
      target: 'timeslot',
    },
    users: {
      type: 'many-to-one',
      target: 'Users',
      joinColumn: {
        name: 'owner_id',
        referenceColumnName: 'id',
      },
    },
    reservation: {
      type: 'one-to-many',
      target: 'Reservation',
    },
  },
});

module.exports = Courts;
