function courtFilterBuilder(
  districtId,
  date,
  time,
  parkingId,
  rentalEquip,
  showerFacility,
  hasAmenities,
  courtTypeId,
  courtId
) {
  let conditionArr = [];

  if (districtId) {
    let districtArr = [];
    districtArr.push(districtId);
    conditionArr.push(`c.district_id IN (${districtArr.join(',')})`);
  }

  if (!time && date) {
    let dateArr = [];
    dateArr.push(date);
    conditionArr.push(
      `(DATE(t.time_slot) IN (${dateArr}) AND t.is_available = 1)`
    );
  }

  if (time && date) {
    let dateTimeArr = [];

    for (let i = 0; i < time.length; i++) {
      dateTimeArr.push(
        date.substr(0, date.length - 1) + ' ' + time[i].substr(1)
      );
    }

    conditionArr.push(
      `(t.time_slot IN (${[dateTimeArr]}) AND t.is_available = 1)`
    );
  }

  if (parkingId) {
    let parkingArr = [];
    parkingArr.push(parkingId);
    conditionArr.push(`c.parking_id = ${parkingId}`);
  }

  if (rentalEquip) {
    conditionArr.push(`c.rental_equip = ${rentalEquip}`);
  }

  if (showerFacility) {
    conditionArr.push(`c.shower_facility = ${showerFacility}`);
  }

  if (hasAmenities) {
    conditionArr.push(`c.has_amenities = ${hasAmenities}`);
  }

  if (courtTypeId) {
    let courtTypeArr = [];
    courtTypeArr.push(courtTypeId);
    conditionArr.push(`c.court_type_id = ${courtTypeId}`);
  }

  if (courtId) {
    conditionArr.push(`c.id = ${courtId}`);
  }

  let whereCondition = '';
  if (conditionArr.length > 0) {
    whereCondition = `WHERE ${conditionArr.join(' AND ')}`;
  }
  return whereCondition;
}

function matchFilterBuilder(date) {
  let conditionArr = [];

  if (date) {
    conditionArr.push(` AND (DATE(r.time_slot) = ${date})`);
  }

  let whereCondition = '';
  if (conditionArr.length > 0) {
    whereCondition = `${conditionArr.join(' AND ')}`;
  }
  return whereCondition;
}

function limitBuilder(limit, offset) {
  if (!limit) {
    limit = 12;
  }

  if (!offset) {
    offset = 0;
  }

  return `LIMIT ${limit} OFFSET ${offset}`;
}

function orderByBuilder(orderBy) {
  let orderQuery = '';
  switch (orderBy) {
    case 'Asc':
      orderQuery = 'ORDER BY c.id ASC';
      break;
    case 'Desc':
      orderQuery = 'ORDER BY c.id DESC';
      break;
    default:
      orderQuery = 'ORDER BY c.id';
      break;
  }
  return orderQuery;
}

module.exports = {
  courtFilterBuilder,
  matchFilterBuilder,
  limitBuilder,
  orderByBuilder,
};
