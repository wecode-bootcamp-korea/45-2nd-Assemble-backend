-- migrate:up
CREATE TABLE reservations (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    court_id INT NOT NULL,
    reservation_number VARCHAR(200) NOT NULL UNIQUE,
    time_slot DATETIME NOT NULL,
    is_match BOOLEAN NOT NULL,
    payment_status_id INT NOT NULL,
    host_user_id INT NOT NULL,
    FOREIGN KEY (court_id) REFERENCES courts (id),
    FOREIGN KEY (payment_status_id) REFERENCES payment_status (id),
    FOREIGN KEY (host_user_id) REFERENCES users (id),
    creaeted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP
)
-- migrate:down
DROP TABLE reservations;