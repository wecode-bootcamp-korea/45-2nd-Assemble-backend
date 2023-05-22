require('dotenv').config();

const { createApp } = require('./app.js');
const { dataSource } = require('./dataSource');

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
    app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
  } catch (err) {
    console.error(err);
  }
};

startServer();
