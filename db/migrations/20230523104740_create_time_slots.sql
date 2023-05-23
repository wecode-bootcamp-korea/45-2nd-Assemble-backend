-- migrate:up
CREATE TABLE time_slots (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    court_id INT NOT NULL,
    time_slot DATETIME NOT NULL,
    is_available BOOLEAN NOT NULL,
    FOREIGN KEY (court_id) REFERENCES courts (id)
)
-- migrate:down
DROP TABLE time_slots;