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
       m.id matchId,
       m.guest_user_id guestUserId,
       ms.status matchStatus,
       (SELECT JSON_OBJECT (
       		"reservationId", r.id,
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
       		"courtId", c.id,
       		"courtName", c.name,
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
       		"description", c.description,
          "courtImage", (SELECT court_image FROM court_images WHERE court_id = c.id LIMIT 1)
       		) 
       		FROM courts c
       		JOIN parkings p ON p.id = c.parking_id
       		JOIN districts d ON d.id = c.district_id
       		LEFT JOIN regions r ON r.id = d.region_id
       		WHERE c.id = r.court_id
       ) court,
       (SELECT JSON_OBJECT (
       		"userId", u.id,
       		"kakaoId", u.kakao_id,
       		"userName", u.name,
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

const getMatchList = async (userLevel, date, page, limit) => {
  try {
    const baseQuery = `
      SELECT
      r.id AS reservationId,
      m.id AS matchId,
      ( SELECT
        JSON_OBJECT(
          'courtId', c.id,
          'courtName', c.name,
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
          'description', c.description,
          'courtImage', (SELECT court_image FROM court_images WHERE court_id = c.id LIMIT 1)
          )
        FROM courts c
        LEFT JOIN parkings p ON p.id = c.parking_id
        LEFT JOIN districts d ON d.id = c.district_id
        LEFT JOIN regions r ON r.id = d.region_id
        LEFT JOIN court_types ct ON ct.id = c.court_type_id
        WHERE c.id = r.court_id
      ) AS courtInfo,
      r.reservation_number AS reservationNumber,
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
      LEFT JOIN matches m ON m.reservation_id = r.id
    `;

    let fixedWhereCondition = `WHERE ps.id = 1 AND r.is_match = 1`;

    if (userLevel) {
      fixedWhereCondition = `WHERE ps.id = 1 AND r.is_match = 1 AND l.level = ${userLevel}`;
    }

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

const completeMatch = async (guestUser, matchId, reservationInfo, response) => {
  const queryRunner = dataSource.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    if (reservationInfo.hostUser == guestUser) {
      const error = new Error('CANNOT_JOIN_MATCH_HOSTED_BY_YOURSELF');
      error.statusCode = 400;
      throw error;
    }

    const [isMatchExistAtSameTime] = await queryRunner.query(
      `SELECT EXISTS (
                SELECT r.time_slot
                FROM reservations r
                LEFT JOIN payments p ON p.reservation_id = r.id
                LEFT JOIN users u ON p.user_id = u.id
                WHERE u.id = ?
                AND r.time_slot = ?
                AND p.is_match = 1
                ) AS isExist`,
      [guestUser, reservationInfo.timeSlot]
    );

    if (isMatchExistAtSameTime.isExist == 1) {
      const error = new Error(
        'A_MATCH_REQUESTED_AT_THE_SAME_TIME_ALREADY_EXISTS'
      );
      error.statusCode = 400;
      throw error;
    }

    const [matchStatus] = await queryRunner.query(
      `SELECT EXISTS (
                SELECT m.match_status_id
                FROM matches m
                WHERE m.match_status_id = 1
                AND m.id = ?
                ) AS matchStatus`,
      [matchId]
    );

    if (matchStatus.matchStatus == 0) {
      const error = new Error('THIS_MATCH_HAS_ALREADY_BEEN_COMPLETED');
      error.statusCode = 400;
      throw error;
    }

    await queryRunner.query(
      `INSERT INTO payments (
            reservation_id,
            user_id,
            is_match,
            payment_info
            ) VALUES (?, ?, 1, ?)
      `,
      [reservationInfo.id, guestUser, JSON.stringify(response)]
    );

    await queryRunner.query(
      `UPDATE reservations r
       SET payment_status_id = 2
       WHERE id = ?
      `,
      [reservationInfo.id]
    );

    await queryRunner.query(
      `UPDATE matches
       SET match_status_id = 2, guest_user_id = ?
       WHERE id = ?
      `,
      [guestUser, matchId]
    );

    const [reservation] = await queryRunner.query(
      `SELECT 
          r.id,
          r.reservation_number reservationNumber,
          r.time_slot timeSlot,
          r.is_match isMatch,
          ps.status paymentStatus,
          r.host_user_id hostUserId,
          (SELECT JSON_OBJECT (
            "courtId", c.id,
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
            "description", c.description,
            "courtImages", (SELECT JSON_ARRAYAGG(JSON_OBJECT("courtImage", court_image)) FROM court_images WHERE court_id = c.id)
            ) 
            FROM courts c
            JOIN parkings p ON p.id = c.parking_id
            JOIN districts d ON d.id = c.district_id
            LEFT JOIN regions r ON r.id = d.region_id
            WHERE c.id = r.court_id
        ) court,
        p.payment_info paymentInfo
        FROM reservations r
        JOIN payment_status ps ON r.payment_status_id = ps.id
        JOIN payments p ON p.reservation_id = ?
        WHERE r.id = ?
        `,
      [reservationInfo.id, reservationInfo.id]
    );

    await queryRunner.commitTransaction();

    return reservation;
  } catch (error) {
    error = new Error('DATABASE_CONNECTON_ERROR');
    error.statusCode = 400;
    throw error;
  }
};

module.exports = {
  getMatchList,
  getUserLevel,
  getGuestMatches,
  completeMatch,
};
