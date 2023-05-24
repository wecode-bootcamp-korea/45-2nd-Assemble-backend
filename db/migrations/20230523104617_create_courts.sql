-- migrate:up
CREATE TABLE courts (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    address TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    parking_id INT NOT NULL,
    rental_equip BOOLEAN NOT NULL,
    shower_facility BOOLEAN NOT NULL,
    has_amenities BOOLEAN NOT NULL,
    district_id INT NOT NULL,
    court_type_id INT NOT NULL,
    owner_id INT NOT NULL,
    description VARCHAR(400) NULL,
    FOREIGN KEY (parking_id) REFERENCES parkings (id),
    FOREIGN KEY (district_id) REFERENCES districts (id),
    FOREIGN KEY (court_type_id) REFERENCES court_types (id),
    FOREIGN KEY (owner_id) REFERENCES users (id),
    creaeted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP
)
-- migrate:down
DROP TABLE courts;