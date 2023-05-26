const { dataSource } = require('./dataSource');
const builder = require('./builder');

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
  limit,
  offset,
  orderBy
) => {
  try {
    const baseQuery = `
    SELECT DISTINCT
        c.id,
        c.name,
        CAST(c.price AS DECIMAL(10,0)) AS price,
        c.address,
        c.longitude,
        c.latitude,
        d.district,
        c.owner_id AS ownerId,
        p.parking,
        d.district,
        r.region,
        c.rental_equip AS rentalEquip,
        c.shower_facility AS showerFacility,
        c.has_amenities AS amenities,
        ct.type,
        ct.is_indoor AS isIndoor,
        c.description,
        ( SELECT
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'timeSlot', t.time_slot,
                    'isAvailable', t.is_available
                ))
            FROM time_slots t
            WHERE t.court_id = c.id
        ) timeSlot,
        ( SELECT
            JSON_ARRAYAGG(
                ci.court_image
            )
        FROM court_images ci
        WHERE ci.court_id = c.id
        ) courtImage
    FROM courts c
    LEFT JOIN parkings p ON c.parking_id = p.id
    LEFT JOIN time_slots t ON t.court_id = c.id
    LEFT JOIN districts d ON c.district_id = d.id
    LEFT JOIN regions r ON r.id = d.region_id
    LEFT JOIN court_types ct ON c.court_type_id = ct.id
    `;
    const whereCondition = builder.courtFilterBuilder(
      districtId,
      date,
      time,
      parkingId,
      rentalEquip,
      showerFacility,
      hasAmenities,
      courtTypeId,
      courtId
    );
    const sortQuery = builder.orderByBuilder(orderBy);
    const limitQuery = builder.limitBuilder(limit, offset);
    const rooms = await dataSource.query(
      `${baseQuery} ${whereCondition} ${sortQuery} ${limitQuery}`
    );
    return rooms;
  } catch (error) {
    console.log(error);
    error = new Error('FAILED_TO_BUILD_FILTER_QUERY');
    error.statusCode = 400;
    throw error;
  }
};

module.exports = {
  getCourtList,
};
