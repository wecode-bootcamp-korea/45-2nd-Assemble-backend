const { dataSource } = require('./dataSource');
const builder = require('./builder');
const { reservationExpiredBuilder } = require('./builder');

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
    error = new Error('DATABASE_CONNECITON_ERROR');
    error.statusCode = 400;
    throw error;
  }
};

const getGuestMatches = async (userId, currentTime, isExpired) => {
  try {
    const reservationExpired = reservationExpiredBuilder(isExpired);

    return await dataSource.query(
      `
    SELECT
       m.id,
       m.guest_user_id guestUserId,
       ms.status matchStatus,
       (SELECT JSON_OBJECT (
       		"id", r.id,
       		"reservationNumber", r.reservation_number,
       		"courtId", r.court_id,
       		"timeSlot", r.time_slot,
       		"isMatch", is_match,
       		"paymentStatus", ps.status
       		) 
       		FROM reservations r
       		JOIN payment_status ps ON ps.id = r.payment_status_id
       		WHERE r.id = m.reservation_id
       ) reservation,
       (SELECT JSON_OBJECT (
       		"id", c.id,
       		"name", c.name,
       		"address", c.address,
       		"longitude", c.longitude,
       		"latitude", c.latitude,
       		"price", c.price,
       		"rentalEquip", c.rental_equip,
       		"showerFacility", c.shower_facility,
       		"hasAmenities", c.has_amenities,
       		"isExclusive", c.is_exclusive,
       		"parking", p.parking,
       		"district", d.district,
       		"region", r.region,
       		"description", c.description
       		) 
       		FROM courts c
       		JOIN parkings p ON p.id = c.parking_id
       		JOIN districts d ON d.id = c.district_id
       		LEFT JOIN regions r ON r.id = d.region_id
       		WHERE c.id = r.court_id
       ) court,
       (SELECT JSON_OBJECT (
       		"id", u.id,
       		"kakaoId", u.kakao_id,
       		"name", u.name,
       		"gender", u.gender,
       		"level", l.level
       		) 
       		FROM users u
       		JOIN levels l ON l.id = u.level_id
       		WHERE u.id = r.host_user_id
       ) host
       FROM matches m
       JOIN match_status ms ON ms.id = m.match_status_id
       JOIN reservations r ON r.id = m.reservation_id
       WHERE m.guest_user_id = ? ${reservationExpired}
       ORDER BY r.time_slot DESC
       `,
      [userId, currentTime]
    );
  } catch (error) {
    error = new Error('DATABASE_CONNECITON_ERROR');
    error.statusCode = 400;
    throw error;
  }
};

const getMatchList = async (date, page, limit) => {
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
    const limitQuery = builder.limitBuilder(page, limit);

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

const getMatchListForUser = async (userLevel, date, page, limit) => {
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
    const limitQuery = builder.limitBuilder(page, limit);

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
  getGuestMatches,
};
