-- migrate:up
CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    kakao_id BIGINT NOT NULL UNIQUE,
    name VARCHAR(100) NULL,
    gender VARCHAR(50) NULL,
    level_id INT NULL,
    FOREIGN KEY (level_id) REFERENCES levels (id),
    creaeted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP
)
-- migrate:down
DROP TABLE users;