-- migrate:up
CREATE TABLE payments (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    reservation_id INT NOT NULL,
    user_id INT NOT NULL,
    is_match BOOLEAN NOT NULL,
    FOREIGN KEY (reservation_id) REFERENCES reservations (id),
    FOREIGN KEY (user_id) REFERENCES users (id),
    creaeted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP
)
-- migrate:down
DROP TABLE payments;