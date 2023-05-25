const courtService = require('../services/courtService');
const { catchAsync } = require('../middlewares/error');

const getCourtList = catchAsync(async (req, res) => {
  const {
    districtId,
    date,
    time,
    parkingId,
    rentalEquip,
    showerFacility,
    hasAmenities,
    courtTypeId,
    courtId,
    limit,
    offset,
    orderBy,
  } = req.query;

  const courts = await courtService.getCourtList(
    districtId,
    date,
    time,
    parkingId,
    rentalEquip,
    showerFacility,
    hasAmenities,
    courtTypeId,
    courtId,
    limit,
    offset,
    orderBy
  );
  return res.status(200).json(courts);
});

module.exports = {
  getCourtList,
};
