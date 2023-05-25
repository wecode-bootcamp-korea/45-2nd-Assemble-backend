const reservationService = require('../services/reservationService');
const { catchAsync } = require('../middlewares/error');
const { format } = require('date-fns');

const getHostReservations = catchAsync(async (req, res) => {
  const user = req.user;
  const { isExpired, isMatch } = req.query;

  const currentTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

  const reservation = await reservationService.getHostReservations(
    user.id,
    currentTime,
    isExpired,
    isMatch
  );

  return res.status(200).json({ data: reservation });
});

module.exports = {
  getHostReservations,
};
