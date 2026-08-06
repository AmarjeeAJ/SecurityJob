CREATE TABLE IF NOT EXISTS export_logs (
  id BIGSERIAL PRIMARY KEY,
  owner_user_id INTEGER NOT NULL REFERENCES owner_users (id) ON DELETE CASCADE,
  exported_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  filters_json JSONB NOT NULL DEFAULT '{}',
  record_count INTEGER NOT NULL DEFAULT 0,
  ip_hash VARCHAR(64)
);

CREATE INDEX IF NOT EXISTS idx_export_logs_owner_user_id ON export_logs (owner_user_id);
CREATE INDEX IF NOT EXISTS idx_export_logs_exported_at ON export_logs (exported_at);
