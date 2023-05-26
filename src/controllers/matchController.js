const matchService = require('../services/matchService');
const { catchAsync } = require('../middlewares/error');

const getMatchList = catchAsync(async (req, res) => {
  const userId = req.userId;
  const { date, limit, offset } = req.query;

  if (!userId) {
    const matches = await matchService.getMatchList(date, limit, offset);
    return res.status(200).json(matches);
  }

  const matches = await matchService.getMatchListForUser(
    userId,
    date,
    limit,
    offset
  );
  return res.status(200).json(matches);
});

module.exports = {
  getMatchList,
};
