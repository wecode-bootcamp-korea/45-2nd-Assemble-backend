const { dataSource } = require('./dataSource');
const builder = require('./builder');

const getUserLevel = async (userId) => {
  try {
    return await dataSource.query(
      `
      SELECT
        l.level
      FROM users u
      LEFT JOIN levels l ON u.level_id = l.id
      WHERE u.id = ?
    `,
      [userId]
    );
  } catch (error) {
    console.log(error);
    error = new Error('FAILED_TO_BUILD_FILTER_QUERY');
    error.statusCode = 400;
    throw error;
  }
};

const getMatchList = async (date, limit, offset) => {
  try {
    const baseQuery = `
      SELECT
      r.id AS reservationId,
      ( SELECT
        JSON_OBJECT(
          'courtId', c.id,
          'name', c.name,
          'address', c.address,
          'latitude', c.latitude,
          'longitude', c.longitude,
          'price', c.price,
          'parkingId', p.parking,
          'rentalEquip', c.rental_equip,
          'showerFacility', c.shower_facility,
          'amenities', c.has_amenities,
          'isExclusive', c.is_exclusive,
          'district', d.district,
          'region', r.region,
          'type', ct.type,
          'indoor', ct.is_indoor,
          'ownerId', c.owner_id,
          'description', c.description
          )
        FROM courts c
        LEFT JOIN parkings p ON p.id = c.parking_id
        LEFT JOIN districts d ON d.id = c.district_id
        LEFT JOIN regions r ON r.id = d.region_id
        LEFT JOIN court_types ct ON ct.id = c.court_type_id
        WHERE c.id = r.court_id
      ) AS courtInfo,
      r.reservation_number,
      r.time_slot AS timeSlot,
      r.is_match AS isMatch,
      ps.status,
      ( SELECT
        JSON_OBJECT(
          'userId', u.id,
          'kakaoId', u.kakao_id,
          'name', u.name,
          'gender', u.gender,
          'levelId', l.level)
        FROM users u
        LEFT JOIN levels l ON l.id = u.level_id
        WHERE u.id = r.host_user_id
      ) AS hostInfo,
      r.creaeted_at AS createdAt
      FROM reservations r
      LEFT JOIN payment_status ps ON ps.id = r.payment_status_id
      LEFT JOIN users u ON r.host_user_id = u.id
      LEFT JOIN levels l ON u.level_id = l.id
    `;
    const fixedWhereCondition = `WHERE ps.id = 1 AND r.is_match = 1`;
    const whereCondition = builder.matchFilterBuilder(date);
    const limitQuery = builder.limitBuilder(limit, offset);

    const rooms = await dataSource.query(
      `${baseQuery} ${fixedWhereCondition} ${whereCondition} ${limitQuery}`
    );
    return rooms;
  } catch (error) {
    console.log(error);
    error = new Error('FAILED_TO_BUILD_FILTER_QUERY');
    error.statusCode = 400;
    throw error;
  }
};

const getMatchListForUser = async (userLevel, date, limit, offset) => {
  try {
    const baseQuery = `
      SELECT
      r.id AS reservationId,
      ( SELECT
        JSON_OBJECT(
          'courtId', c.id,
          'name', c.name,
          'address', c.address,
          'latitude', c.latitude,
          'longitude', c.longitude,
          'price', c.price,
          'parkingId', p.parking,
          'rentalEquip', c.rental_equip,
          'showerFacility', c.shower_facility,
          'amenities', c.has_amenities,
          'isExclusive', c.is_exclusive,
          'district', d.district,
          'region', r.region,
          'type', ct.type,
          'indoor', ct.is_indoor,
          'ownerId', c.owner_id,
          'description', c.description
          )
        FROM courts c
        LEFT JOIN parkings p ON p.id = c.parking_id
        LEFT JOIN districts d ON d.id = c.district_id
        LEFT JOIN regions r ON r.id = d.region_id
        LEFT JOIN court_types ct ON ct.id = c.court_type_id
        WHERE c.id = r.court_id
      ) AS courtInfo,
      r.reservation_number,
      r.time_slot AS timeSlot,
      r.is_match AS isMatch,
      ps.status,
      ( SELECT
        JSON_OBJECT(
          'userId', u.id,
          'kakaoId', u.kakao_id,
          'name', u.name,
          'gender', u.gender,
          'levelId', l.level)
        FROM users u
        LEFT JOIN levels l ON l.id = u.level_id
        WHERE u.id = r.host_user_id
      ) AS hostInfo,
      r.creaeted_at AS createdAt
      FROM reservations r
      LEFT JOIN payment_status ps ON ps.id = r.payment_status_id
      LEFT JOIN users u ON r.host_user_id = u.id
      LEFT JOIN levels l ON u.level_id = l.id
    `;
    const fixedWhereCondition = `WHERE ps.id = 1 AND r.is_match = 1 AND l.level = ${userLevel}`;
    const whereCondition = builder.matchFilterBuilder(date);
    const limitQuery = builder.limitBuilder(limit, offset);

    const rooms = await dataSource.query(
      `${baseQuery} ${fixedWhereCondition} ${whereCondition} ${limitQuery}`
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
  getMatchList,
  getUserLevel,
  getMatchListForUser,
};
