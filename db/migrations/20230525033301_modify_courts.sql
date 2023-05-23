-- migrate:up
ALTER TABLE courts ADD COLUMN name VARCHAR(100) NOT NULL;

-- migrate:down

