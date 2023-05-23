-- migrate:up
CREATE TABLE regions (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    region VARCHAR(50) NOT NULL
)
-- migrate:down

