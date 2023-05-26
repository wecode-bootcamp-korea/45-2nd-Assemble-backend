require('dotenv').config();

const { createApp } = require('./app.js');
const reservationService = require('./src/services/reservationService');
const { dataSource } = require('./src/models/dataSource');
const { scheduleJob } = require('node-schedule');

const cancelReservation = () => {
  scheduleJob('0 0 0 * * *', async () => {
    await reservationService.cancelReservation();
  });
};

const startServer = async () => {
  try {
    const app = createApp();
    const PORT = process.env.PORT;

    dataSource
      .initialize()
      .then(() => {
        console.log('Data Source has been initialized!');
      })
      .catch((err) => {
        console.log('Error occurred during Data Source initialization', err);
        dataSource.destroy();
      });
    app.listen(PORT, () => {
      console.log(`Server is listening on ${PORT}`);
      cancelReservation();
    });
  } catch (err) {
    console.error(err);
  }
};

startServer();
