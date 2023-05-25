-- migrate:up
ALTER TABLE courts ADD COLUMN latitude VARCHAR(100) NOT NULL;
ALTER TABLE courts ADD COLUMN longitude VARCHAR(100) NOT NULL;

-- migrate:down

