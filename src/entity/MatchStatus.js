const { EntitySchema } = require('typeorm');

const MatchStatus = new EntitySchema({
  name: 'MatchStatus',
  tableName: 'match_status',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    status: {
      type: 'varchar',
      length: 100,
      charset: 'utf8mb4',
      collation: 'utf8mb4_general_ci',
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
    matches: {
      type: 'one-to-many',
      target: 'Matches',
    },
  },
});

module.exports = MatchStatus;
