-- migrate:up
ALTER TABLE matches MODIFY COLUMN guest_user_id INT NULL;

-- migrate:down

