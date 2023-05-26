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
  orderBy
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
    orderBy
  );

  return getCourtList;
};

module.exports = {
  getCourtList,
};
