-- migrate:up
CREATE TABLE matches (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    reservation_id INT NOT NULL,
    guest_user_id INT NOT NULL,
    match_status_id INT NOT NULL,
    FOREIGN KEY (reservation_id) REFERENCES reservations (id),
    FOREIGN KEY (guest_user_id) REFERENCES users (id),
    FOREIGN KEY (match_status_id) REFERENCES match_status (id),
    creaeted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP
)
-- migrate:down
DROP TABLE matches;