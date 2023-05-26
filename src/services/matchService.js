const matchDao = require('../models/matchDao');

const getMatchList = async (date, page, limit) => {
  const getMatchList = await matchDao.getMatchList(date, page, limit);

  return getMatchList;
};

const getMatchListForUser = async (userId, date, page, limit) => {
  const [getUserLevel] = await matchDao.getUserLevel(userId);
  const userLevel = getUserLevel.level;

  const getMatchListForUser = await matchDao.getMatchListForUser(
    userLevel,
    date,
    page,
    limit
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
