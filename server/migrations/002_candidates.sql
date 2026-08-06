CREATE TABLE IF NOT EXISTS candidate_code_sequences (
  year SMALLINT PRIMARY KEY,
  last_value INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS candidates (
  id BIGSERIAL PRIMARY KEY,
  candidate_code VARCHAR(30) NOT NULL UNIQUE,
  full_name VARCHAR(150) NOT NULL,
  mobile_number VARCHAR(15) NOT NULL,
  normalized_mobile_number VARCHAR(15) NOT NULL,
  whatsapp_number VARCHAR(15) NOT NULL,
  normalized_whatsapp_number VARCHAR(15) NOT NULL,
  alternate_mobile_number VARCHAR(15),
  email VARCHAR(150),
  date_of_birth DATE,
  age SMALLINT NOT NULL CHECK (age BETWEEN 18 AND 65),
  gender VARCHAR(20) NOT NULL,
  current_city VARCHAR(100) NOT NULL,
  current_area VARCHAR(150),
  state VARCHAR(100) NOT NULL,
  highest_qualification VARCHAR(100),
  total_experience_months INTEGER NOT NULL DEFAULT 0,
  security_experience_months INTEGER NOT NULL DEFAULT 0,
  previous_company VARCHAR(150),
  current_employment_status VARCHAR(50) NOT NULL,
  joining_availability VARCHAR(50) NOT NULL,
  expected_salary INTEGER,
  shift_preference VARCHAR(50),
  duty_hour_preference VARCHAR(50) NOT NULL,
  height_cm SMALLINT,
  languages VARCHAR(255),
  ex_serviceman BOOLEAN NOT NULL DEFAULT FALSE,
  aadhaar_available BOOLEAN NOT NULL DEFAULT FALSE,
  police_verification_available BOOLEAN NOT NULL DEFAULT FALSE,
  training_certificate_available BOOLEAN NOT NULL DEFAULT FALSE,
  driving_licence_available BOOLEAN NOT NULL DEFAULT FALSE,
  additional_message TEXT,
  consent_given BOOLEAN NOT NULL DEFAULT FALSE,
  consent_timestamp TIMESTAMPTZ,
  consent_text_version VARCHAR(20),
  first_registered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_candidates_normalized_mobile ON candidates (normalized_mobile_number);
CREATE UNIQUE INDEX IF NOT EXISTS idx_candidates_candidate_code ON candidates (candidate_code);
CREATE INDEX IF NOT EXISTS idx_candidates_current_city ON candidates (current_city);
CREATE INDEX IF NOT EXISTS idx_candidates_created_at ON candidates (created_at);
CREATE INDEX IF NOT EXISTS idx_candidates_last_submitted_at ON candidates (last_submitted_at);
CREATE INDEX IF NOT EXISTS idx_candidates_full_name_trgm ON candidates (full_name);

CREATE TABLE IF NOT EXISTS candidate_roles (
  id BIGSERIAL PRIMARY KEY,
  candidate_id BIGINT NOT NULL REFERENCES candidates (id) ON DELETE CASCADE,
  role_name VARCHAR(80) NOT NULL,
  other_role_text VARCHAR(150),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (candidate_id, role_name)
);

CREATE INDEX IF NOT EXISTS idx_candidate_roles_role_name ON candidate_roles (role_name);
CREATE INDEX IF NOT EXISTS idx_candidate_roles_candidate_id ON candidate_roles (candidate_id);

CREATE TABLE IF NOT EXISTS candidate_preferred_locations (
  id BIGSERIAL PRIMARY KEY,
  candidate_id BIGINT NOT NULL REFERENCES candidates (id) ON DELETE CASCADE,
  city_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (candidate_id, city_name)
);

CREATE INDEX IF NOT EXISTS idx_candidate_locations_city_name ON candidate_preferred_locations (city_name);
CREATE INDEX IF NOT EXISTS idx_candidate_locations_candidate_id ON candidate_preferred_locations (candidate_id);
