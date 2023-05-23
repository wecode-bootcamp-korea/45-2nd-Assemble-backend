-- migrate:up
CREATE TABLE court_types (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    court_type VARCHAR(50) NOT NULL,
    indoor BOOLEAN NOT NULL
)
-- migrate:down
DROP TABLE court_types;