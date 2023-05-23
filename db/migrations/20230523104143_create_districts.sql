-- migrate:up
CREATE TABLE districts (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    district VARCHAR(50) NOT NULL,
    district_image VARCHAR(400) NOT NULL
)
-- migrate:down
DROP TABLE districts;