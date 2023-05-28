const matchService = require('../services/matchService');
const { catchAsync } = require('../middlewares/error');
const { format } = require('date-fns');

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

const getGuestMatches = catchAsync(async (req, res) => {
  const user = req.user;
  const { isExpired } = req.query;

  const currentTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

  const matches = await matchService.getGuestMatches(
    user.id,
    currentTime,
    isExpired
  );

  return res.status(200).json({ data: matches });
});

const completeMatch = catchAsync(async (req, res) => {
  const guestUser = req.user.id;
  const { matchId, paymentKey, amount, orderId } = req.body;

  const match = await matchService.completeMatch(
    guestUser,
    matchId,
    paymentKey,
    amount,
    orderId
  );

  return res.status(200).json({ match: match });
});

module.exports = {
  getMatchList,
  getGuestMatches,
  completeMatch,
};
