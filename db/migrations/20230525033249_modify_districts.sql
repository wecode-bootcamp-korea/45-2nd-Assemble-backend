-- migrate:up
ALTER TABLE districts DROP COLUMN image_url;
ALTER TABLE districts ADD COLUMN region_id INT NULL;
ALTER TABLE districts ADD FOREIGN KEY (region_id) REFERENCES regions (id);
-- migrate:down

