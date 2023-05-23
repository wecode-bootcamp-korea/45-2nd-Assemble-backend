-- migrate:up
CREATE TABLE parkings (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    parking VARCHAR(50) NOT NULL
)
-- migrate:down
DROP TABLE parkings;