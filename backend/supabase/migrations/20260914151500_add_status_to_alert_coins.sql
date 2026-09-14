CREATE TYPE alert_status AS ENUM (
    'ACTIVE',
    'COMPLETED'
);

ALTER TABLE alert_coins
ADD COLUMN status alert_status NOT NULL DEFAULT 'ACTIVE';
