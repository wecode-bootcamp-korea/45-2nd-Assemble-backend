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
  page,
  orderBy,
  dateForCourt
) => {
  try {
    const dateCondition = builder.dateBuilder(dateForCourt);

    const baseQuery = `
    SELECT DISTINCT
        c.id courtId,
        CAST(c.price AS DECIMAL(10,0)) price,
        c.name courtName,
        c.address,
        c.longitude,
        c.latitude,
        c.owner_id ownerId,
        p.parking,
        d.district,
        r.region,
        c.rental_equip rentalEquip,
        c.shower_facility showerFacility,
        c.has_amenities amenities,
        ct.type,
        ct.is_indoor isIndoor,
        c.description,
        c.is_exclusive isExclusive,
        COALESCE(
            (SELECT
              JSON_ARRAYAGG(
                JSON_OBJECT(
                    'timeSlot', DATE_FORMAT(t.time_slot, '%Y-%m-%d %H:00:00') ,
                    'isAvailable', t.is_available
                )
            )
            FROM time_slots t
            WHERE t.court_id = c.id ${dateCondition}
            ), JSON_ARRAY()) timeSlots,
        COALESCE(
            (SELECT
              JSON_ARRAYAGG(ci.court_image
            )
            FROM court_images ci
            WHERE ci.court_id = c.id
            ), JSON_ARRAY()) courtImage
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
    const limitQuery = builder.limitBuilder(page);
    const rooms = await dataSource.query(
      `${baseQuery} ${whereCondition} ${sortQuery} ${limitQuery}`
    );

    return rooms;
  } catch (error) {
    error = new Error('FAILED_TO_BUILD_FILTER_QUERY');
    error.statusCode = 400;
    throw error;
  }
};

const getHostingCourts = async (userId) => {
  try {
    return await dataSource.query(
      `
      SELECT
        c.id courtId,
        c.name courtName,
        c.price,
        c.address,
        c.longitude,
        c.latitude,
        d.district,
        r.region,
        c.owner_id ownerId,
        p.parking,
        c.rental_equip rentalEquip,
        c.shower_facility showerFacility,
        c.has_amenities amenities,
        ct.type,
        ct.is_indoor isIndoor,
        c.description,
        c.is_exclusive isExclusive,
        ( SELECT
               JSON_ARRAYAGG(
                ci.court_image) 
        FROM court_images ci
        WHERE ci.court_id = c.id
        LIMIT 1
        ) courtImage
      FROM courts c
      JOIN districts d ON c.district_id = d.id
      JOIN parkings p ON c.parking_id = p.id
      JOIN court_types ct ON c.court_type_id = ct.id
      LEFT JOIN regions r ON r.id = d.region_id
      WHERE c.owner_id = ?
    `,
      [userId]
    );
  } catch (error) {
    error = new Error('FAILED_TO_BUILD_FILTER_QUERY');
    error.statusCode = 400;
    throw error;
  }
};

const createCourt = async (userId, imageurl, name, address, price) => {
  try {
    const court = await dataSource.query(
      `
      INSERT INTO courts (
        address, 
        price, 
        parking_id, 
        rental_equip, 
        shower_facility, 
        has_amenities, 
        district_id, 
        court_type_id, 
        owner_id, 
        description, 
        latitude,
        longitude,
        name,
        is_exclusive
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )`,
      [
        address,
        price,
        1,
        1,
        1,
        1,
        1,
        1,
        userId,
        'this is the description',
        12345,
        12345,
        name,
        1,
      ]
    );

    await dataSource.query(
      `
      INSERT INTO court_images (
        court_id,
        court_image
      ) VALUES (
        ?, ?
      )`,
      [court.insertId, imageurl]
    );
  } catch (error) {
    error = new Error('DATABASE_CONNECTION_ERROR');
    error.statusCode = 400;
    throw error;
  }
};

module.exports = {
  getCourtList,
  getHostingCourts,
  createCourt,
};
