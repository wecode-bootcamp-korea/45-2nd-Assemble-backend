const courtDao = require('../models/courtDao');

const getCourtList = async (
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
) => {
  const getCourtList = await courtDao.getCourtList(
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

  return getCourtList;
};

const getHostingCourts = async (userId) => {
  return await courtDao.getHostingCourts(userId);
};

module.exports = {
  getCourtList,
  getHostingCourts,
};
