-- migrate:up
CREATE TABLE levels (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    level INT NOT NULL
)
-- migrate:down
DROP TABLE levels;