create table authorities (
  id UUID PRIMARY KEY,
  name TEXT,
  wallet_address TEXT UNIQUE,
  role TEXT,
  created_at TIMESTAMP
);
create table assets (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  owner_name TEXT,
  
  document_hash TEXT NOT NULL,
  ipfs_url TEXT NOT NULL,
  metadata_uri TEXT,
  
  status TEXT, -- pending_mint / active / revoked / expired / mint_failed / fraud_detected / suspended
  issued_by UUID NOT NULL REFERENCES authorities(id),
  
  issued_at TIMESTAMP,
  expiry_date TIMESTAMP,
  
  token_id TEXT,
  tx_hash TEXT,
  
  similarity_score FLOAT,
  is_duplicate BOOLEAN,
  
  verification_url TEXT,
  
  created_at TIMESTAMP
);
create table nft_tokens (
  id UUID PRIMARY KEY,
  asset_id UUID REFERENCES assets(id),
  
  token_id TEXT,
  contract_address TEXT,
  
  mint_tx_hash TEXT,
  metadata_uri TEXT,
  
  minted_at TIMESTAMP
);
create table asset_events (
  id UUID PRIMARY KEY,
  asset_id UUID REFERENCES assets(id),
  
  event_type TEXT, -- ISSUED / VERIFIED / REVOKED / EXPIRED
  
  performed_by TEXT,
  metadata JSONB,
  
  created_at TIMESTAMP
);
create table risk_scores (
  id UUID PRIMARY KEY,
  asset_id UUID REFERENCES assets(id),
  
  score FLOAT,
  last_updated TIMESTAMP
);
create table verification_logs (
  id UUID PRIMARY KEY,
  asset_id UUID REFERENCES assets(id),
  
  verified_by_ip TEXT,
  result TEXT,
  
  is_suspicious BOOLEAN,
  
  created_at TIMESTAMP
);
create table audit_logs (
  id UUID PRIMARY KEY,
  asset_id UUID REFERENCES assets(id),
  action TEXT NOT NULL,
  old_status TEXT,
  new_status TEXT,
  performed_by UUID NOT NULL REFERENCES authorities(id),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE assets
ADD CONSTRAINT check_status
CHECK (
   status IN (
      'pending_mint',
      'active',
      'revoked',
      'expired',
      'mint_failed',
      'fraud_detected',
      'suspended'
   )
);
ALTER TABLE assets
ADD CONSTRAINT unique_document_hash UNIQUE (document_hash);
ALTER TABLE authorities
ADD CONSTRAINT unique_wallet UNIQUE (wallet_address);
ALTER TABLE nft_tokens
ADD CONSTRAINT unique_token UNIQUE (token_id);
CREATE INDEX idx_assets_hash ON assets(document_hash);
CREATE INDEX idx_assets_status ON assets(status);
CREATE INDEX idx_nft_token_id ON nft_tokens(token_id);
ALTER TABLE assets
ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE authorities
ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE nft_tokens
ADD CONSTRAINT unique_asset UNIQUE (asset_id);
ALTER TABLE nft_tokens
ADD CONSTRAINT fk_asset
FOREIGN KEY (asset_id)
REFERENCES assets(id)
ON DELETE CASCADE;
select * from assets;
