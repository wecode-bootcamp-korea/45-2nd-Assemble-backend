-- migrate:up
CREATE TABLE court_images (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    court_id INT NOT NULL,
    court_image VARCHAR(400) NOT NULL,
    FOREIGN KEY (court_id) REFERENCES courts (id)
)
-- migrate:down
DROP TABLE court_images;