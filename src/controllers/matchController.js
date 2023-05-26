const matchService = require('../services/matchService');
const { catchAsync } = require('../middlewares/error');

const getMatchList = catchAsync(async (req, res) => {
  const userId = req.userId;
  const { date, page, limit } = req.query;

  if (!userId) {
    const matches = await matchService.getMatchList(date, page, limit);
    return res.status(200).json(matches);
  }

  const matches = await matchService.getMatchListForUser(
    userId,
    date,
    page,
    limit
  );
  return res.status(200).json(matches);
});

module.exports = {
  getMatchList,
};
