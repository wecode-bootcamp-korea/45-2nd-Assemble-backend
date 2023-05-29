const { dataSource } = require('./dataSource');
const { reservationExpiredBuilder } = require('./builder');

const getHostReservations = async (userId, currentTime, isExpired, isMatch) => {
  try {
    const reservationExpired = reservationExpiredBuilder(isExpired);

    return await dataSource.query(
      `
    SELECT 
          JSON_OBJECT (
              "id", r.id,
              "reservationNumber", r.reservation_number,
              "timeSlot", r.time_slot,
              "isMatch", r.is_match,
              "hostUserId", r.host_user_id,
              "paymentStatus", ps.status
            ) reservation,
          (SELECT JSON_OBJECT (
          	  "id", c.id,
          	  "name", c.name,
              "address", c.address,
			        "price", c.price,
			        "parking", (SELECT p.parking FROM parkings p WHERE p.id = c.parking_id),
              "rentalEquip", c.rental_equip,
              "showerFacility", c.shower_facility,
              "hasAmenities", c.has_amenities,
              "district", (SELECT d.district FROM districts d WHERE d.id = c.district_id),
              "courtType", (SELECT ct.type FROM court_types ct WHERE ct.id = c.court_type_id),
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

module.exports = { getHostReservations };
