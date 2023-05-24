-- migrate:up
CREATE TABLE court_types (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    is_indoor BOOLEAN NOT NULL
)
-- migrate:down
DROP TABLE court_types;