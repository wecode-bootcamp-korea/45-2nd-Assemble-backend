const typeorm = require('typeorm');

const Courts = require('./src/entity/Courts');
const CourtTypes = require('./src/entity/CourtTypes');
const Districts = require('./src/entity/Districts');
const Levels = require('./src/entity/Levels');
const Matches = require('./src/entity/Matches');
const MatchStatus = require('./src/entity/MatchStatus');
const Parkings = require('./src/entity/Parkings');
const Payment = require('./src/entity/Payment');
const PaymentStatus = require('./src/entity/PaymentStatus');
const Reservation = require('./src/entity/Reservation');
const Timeslot = require('./src/entity/Timeslot');
const Users = require('./src/entity/Users');

const entities = [
  Courts,
  CourtTypes,
  Districts,
  Levels,
  Matches,
  MatchStatus,
  Parkings,
  Payment,
  PaymentStatus,
  Reservation,
  Timeslot,
  Users,
];

const dataSource = new typeorm.DataSource({
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: process.env.DB_SYNCHRONIZE,
  entities: entities,
});

module.exports = { dataSource };
