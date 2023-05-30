const matchDao = require('../models/matchDao');
const reservationDao = require('../models/reservationDao');
const axios = require('axios');

const getMatchList = async (userId, date, page, limit) => {
  let userLevel = null;

  if (userId) {
    const [getUserLevel] = await matchDao.getUserLevel(userId);
    userLevel = getUserLevel.level;
  }

  const getMatchList = await matchDao.getMatchList(
    userLevel,
    date,
    page,
    limit
  );

  return getMatchList;
};

const getGuestMatches = async (userId, currentTime, isExpired) => {
  return await matchDao.getGuestMatches(userId, currentTime, isExpired);
};

const completeMatch = async (
  guestUser,
  matchId,
  paymentKey,
  amount,
  orderId
) => {
  const [reservationInfo] = await reservationDao.getMatchHostInfo(matchId);

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

  return await matchDao.completeMatch(
    guestUser,
    matchId,
    reservationInfo,
    response.data
  );
};

module.exports = {
  getMatchList,
  getGuestMatches,
  completeMatch,
};
