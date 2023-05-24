const reservationDao = require('../models/reservationDao');
const { format } = require('date-fns');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

const getHostReservations = async (userId, currentTime, isExpired, isMatch) => {
  return await reservationDao.getHostReservations(
    userId,
    currentTime,
    isExpired,
    isMatch
  );
};

const cancelReservation = async () => {
  const currentTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  return await reservationDao.cancelReservation(currentTime);
}

const completeReservation = async (
  userId,
  courtId,
  timeSlot,
  isMatch,
  paymentKey,
  amount,
  orderId
) => {
  const reservationNumber = uuidv4();

  const options = {
    method: 'POST',
    url: 'https://api.tosspayments.com/v1/payments/confirm',
    headers: {
      Authorization: `Basic ${process.env.TOSS_SECRET_KEY_ENCODED}`,
      'Content-Type': 'application/json',
    },

    data: {
      paymentKey: paymentKey,
      amount: amount,
      orderId: orderId,
    },
  };

  const response = await axios.request(options);

  if (response.status != 200) {
    const error = new Error('PAYMENT_FAILED');
    error.statusCode = 400;
    throw error;
  }

  return await reservationDao.completeReservation(
    userId,
    reservationNumber,
    courtId,
    timeSlot,
    isMatch,
    response.data
  );
};

module.exports = {
  getHostReservations,
  cancelReservation,
  completeReservation,
};
