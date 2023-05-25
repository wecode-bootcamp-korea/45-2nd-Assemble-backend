-- migrate:up
ALTER TABLE courts ADD COLUMN is_exclusive BOOLEAN NOT NULL;

-- migrate:down

