const { dataSource } = require('./dataSource');
const { reservationExpiredBuilder } = require('./builder');

const paymentStatusEnum = Object.freeze({
  PENDING: 1,
  COMPLETE: 2,
  CANCELED: 3,
});

const matchStatusEnum = Object.freeze({
  UNMATCHED: 1,
  MATCHED: 2,
  CANCELED: 3,
});

const completeReservation = async (
  userId,
  reservationNumber,
  courtId,
  timeSlot,
  isMatch,
  response
) => {
  const queryRunner = dataSource.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  const paymentStatusId = isMatch
    ? paymentStatusEnum.PENDING
    : paymentStatusEnum.COMPLETE;

  try {
    // check if court is available to use
    const [available] = await queryRunner.query(
      `
        SELECT ts.is_available
            FROM time_slots ts
            WHERE ts.court_id = ? AND ts.time_slot = ?
      `,
      [courtId, timeSlot]
    );

    if (!available.is_available) {
      const error = new Error('COURT_IS_ALREADY_BOOKED');
      error.statusCode = 400;
      throw error;
    }

    // change availability
    await queryRunner.query(
      `
        UPDATE time_slots
            SET is_available = 0
            WHERE court_id = ? AND time_slot = ?
        `,
      [courtId, timeSlot]
    );

    // create reservation
    const result = await queryRunner.query(
      `
          INSERT INTO reservations (
              court_id,
              reservation_number,
              time_slot,
              is_match,
              payment_status_id,
              host_user_id
              ) VALUES (
            ?, ?, ?, ?, ?, ?
          )
      `,
      [courtId, reservationNumber, timeSlot, isMatch, paymentStatusId, userId]
    );

    // create payments
    await queryRunner.query(
      `
            INSERT INTO payments (
              reservation_id,
              user_id,
              is_match,
              payment_info
            ) VALUES (?, ?, ?, ?)
            `,
      [result.insertId, userId, isMatch, JSON.stringify(response)]
    );

    // create match
    if (isMatch) {
      await queryRunner.query(
        `
      INSERT INTO matches (
        reservation_id,
        match_status_id
        ) VALUES (?, ?)
        `,
        [result.insertId, matchStatusEnum.UNMATCHED]
      );
    }

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
      [result.insertId, result.insertId]
    );

    await queryRunner.commitTransaction();

    return reservation;
  } catch (error) {
    await queryRunner.rollbackTransaction();

    error = new Error(error.message || 'DATABASE_CONNECTION_ERROR');
    error.statusCode = 400;
    throw error;
  } finally {
    if (queryRunner) {
      await queryRunner.release();
    }
  }
};

const getHostReservations = async (userId, currentTime, isExpired, isMatch) => {
  try {
    const reservationExpired = reservationExpiredBuilder(isExpired);

    return await dataSource.query(
      `
    SELECT 
          JSON_OBJECT (
              "reservationId", r.id,
              "reservationNumber", r.reservation_number,
              "timeSlot", DATE_FORMAT(r.time_slot, '%Y-%m-%d %H:00:00'),
              "isMatch", r.is_match,
              "hostUserId", r.host_user_id,
              "paymentStatus", ps.status
            ) reservation,
          (SELECT JSON_OBJECT (
          	  "courtId", c.id,
          	  "courtName", c.name,
              "address", c.address,
			        "price", c.price,
			        "parking", (SELECT p.parking FROM parkings p WHERE p.id = c.parking_id),
              "rentalEquip", c.rental_equip,
              "showerFacility", c.shower_facility,
              "amenities", c.has_amenities,
              "district", (SELECT d.district FROM districts d WHERE d.id = c.district_id),
              "courtType", (SELECT ct.type FROM court_types ct WHERE ct.id = c.court_type_id),
              "courtImage", (SELECT court_image FROM court_images WHERE court_id = c.id LIMIT 1),
              "ownerId", c.owner_id ) court
              FROM courts c
              WHERE c.id = r.court_id
            ) court,
          (SELECT JSON_OBJECT (
          	  "id", u.id,
          	  "kakaoId", u.kakao_id,
          	  "name", u.name,
              "gender", u.gender,
			        "level", (SELECT l.level FROM levels l WHERE l.id = u.level_id)) guest
			        FROM matches m
			        JOIN users u ON u.id = m.guest_user_id
			        WHERE m.reservation_id = r.id
            ) guest
        FROM reservations r
        JOIN payment_status ps ON ps.id = r.payment_status_id
        WHERE r.host_user_id = ? AND r.is_match = ? ${reservationExpired}
        ORDER BY r.time_slot DESC
        `,
      [userId, isMatch, currentTime]
    );
  } catch (error) {
    error = new Error('DATABASE_CONNECITON_ERROR');
    error.statusCode = 400;
    throw error;
  }
};

const getMatchHostInfo = async (matchId) => {
  try {
    return await dataSource.query(
      `
      SELECT 
        r.id,
        r.reservation_number reservationNumber,
        DATE_FORMAT(r.time_slot, '%Y-%m-%d %H:00:00') timeSlot,
        r.is_match isMatch,
        r.host_user_id hostUser
      FROM reservations r
      LEFT JOIN matches m ON m.reservation_id = r.id
      WHERE m.id = ?
        `,
      [matchId]
    );
  } catch (error) {
    error = new Error('DATABASE_CONNECITON_ERROR');
    error.statusCode = 400;
    throw error;
  }
};

const cancelReservation = async (currentTime) => {
  const queryRunner = dataSource.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    // check if (reservation wants match & haven't matched yet)
    const reservationsToCancel = await queryRunner.query(
      `
      SELECT id, is_match, payment_status_id
        FROM reservations
        WHERE payment_status_id = 1 AND is_match = 1 AND time_slot < ?
      `,
      [currentTime]
    );

    const cancelIds = reservationsToCancel.map((reservation) => reservation.id);

    // payment status to calceled
    await queryRunner.query(
      `
      UPDATE reservation 
      SET payment_status_id = ?
      WHERE id (?)
      `,
      [paymentStatusEnum.CANCELED, cancelIds]
    );

    // match status to calceled
    await queryRunner.query(
      `
      UPDATE matches 
      SET match_status_id = ?
      WHERE reservation_id (?)
      `,
      [matchStatusEnum.CANCELED, cancelIds]
    );

    // todo: payment cancel

    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();

    error = new Error('DATABASE_CONNECITON_ERROR');
    error.statusCode = 400;
    throw error;
  } finally {
    if (queryRunner) {
      await queryRunner.release();
    }
  }
};

module.exports = {
  getHostReservations,
  completeReservation,
  getMatchHostInfo,
  cancelReservation,
};
