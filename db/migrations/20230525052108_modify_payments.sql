-- migrate:up
ALTER TABLE payments ADD COLUMN payment_info JSON NOT NULL;

-- migrate:down

