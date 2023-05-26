const matchDao = require('../models/matchDao');

const getMatchList = async (date, limit, offset) => {
  const getMatchList = await matchDao.getMatchList(date, limit, offset);

  return getMatchList;
};

const getMatchListForUser = async (userId, date, limit, offset) => {
  const [getUserLevel] = await matchDao.getUserLevel(userId);
  const userLevel = getUserLevel.level;

  const getMatchListForUser = await matchDao.getMatchListForUser(
    userLevel,
    date,
    limit,
    offset
  );

  return getMatchListForUser;
};

const getGuestMatches = async (userId, currentTime, isExpired) => {
  return await matchDao.getGuestMatches(userId, currentTime, isExpired);
};

module.exports = {
  getMatchList,
  getMatchListForUser,
  getGuestMatches,
};
