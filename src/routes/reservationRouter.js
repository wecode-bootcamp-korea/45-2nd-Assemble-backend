const express = require('express');

const reservationController = require('../controllers/reservationController');

const router = express.Router();

const { validateToken } = require('../middlewares/auth');

router.get('/host', validateToken, reservationController.getHostReservations);
router.post('', validateToken, reservationController.completeReservation);

module.exports = {
  router,
};
