-- Employment status, joining availability and duty-hour preference are only
-- collected when a candidate marks themselves as experienced (the "Experience"
-- section is now hidden by default for freshers), so they can no longer be
-- guaranteed present on every row.
ALTER TABLE candidates ALTER COLUMN current_employment_status DROP NOT NULL;
ALTER TABLE candidates ALTER COLUMN joining_availability DROP NOT NULL;
ALTER TABLE candidates ALTER COLUMN duty_hour_preference DROP NOT NULL;

ALTER TABLE candidates ADD COLUMN is_experienced boolean NOT NULL DEFAULT false;
