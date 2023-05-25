const reservationDao = require('../models/reservationDao');

const getHostReservations = async (userId, currentTime, isExpired, isMatch) => {
  return await reservationDao.getHostReservations(
    userId,
    currentTime,
    isExpired,
    isMatch
  );
};

module.exports = {
  getHostReservations,
};
