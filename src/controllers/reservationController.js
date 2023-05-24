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

const completeReservation = catchAsync(async (req, res) => {
  const user = req.user;
  const { courtId, timeSlot, isMatch, paymentKey, amount, orderId } = req.body;

  const reservation = await reservationService.completeReservation(
    user.id,
    courtId,
    timeSlot,
    parseInt(isMatch),
    paymentKey,
    parseInt(amount),
    orderId
  );

  return res.status(201).json({ reservation: reservation });
});

module.exports = {
  getHostReservations,
  completeReservation,
};
