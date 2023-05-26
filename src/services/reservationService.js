const reservationDao = require('../models/reservationDao');
const { format } = require('date-fns');

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
};

module.exports = {
  getHostReservations,
  cancelReservation,
};
