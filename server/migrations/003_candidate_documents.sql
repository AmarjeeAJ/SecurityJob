CREATE TABLE IF NOT EXISTS candidate_documents (
  id BIGSERIAL PRIMARY KEY,
  candidate_id BIGINT NOT NULL REFERENCES candidates (id) ON DELETE CASCADE,
  document_type VARCHAR(30) NOT NULL, -- 'photo' | 'resume'
  original_file_name VARCHAR(255) NOT NULL,
  stored_file_name VARCHAR(255) NOT NULL,
  file_url VARCHAR(500) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  file_size INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_candidate_documents_candidate_id ON candidate_documents (candidate_id);
