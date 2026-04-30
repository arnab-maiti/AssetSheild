create table authorities (
  id UUID PRIMARY KEY,
  name TEXT,
  wallet_address TEXT UNIQUE,
  role TEXT,
  created_at TIMESTAMP
);
create table assets (
  id UUID PRIMARY KEY,
  title TEXT,
  description TEXT,
  owner_name TEXT,
  
  document_hash TEXT,
  ipfs_url TEXT,
  
  status TEXT, -- active / revoked / expired
  issued_by UUID REFERENCES authorities(id),
  
  issued_at TIMESTAMP,
  expiry_date TIMESTAMP,
  
  token_id TEXT,
  
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