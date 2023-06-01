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
    page,
    orderBy,
    dateForCourt,
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
    page,
    orderBy,
    dateForCourt
  );
  return res.status(200).json(courts);
});

const getHostingCourts = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const courts = await courtService.getHostingCourts(userId);
  return res.status(200).json(courts);
});

const createCourt = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const image = req.file;
  const { name, address, price } = req.body;

  const court = await courtService.createCourt(
    userId,
    image,
    name,
    address,
    price
  );
  return res.status(201).json({ court });
});

module.exports = {
  getCourtList,
  getHostingCourts,
  createCourt,
};
