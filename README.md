## 📅 Day 4 Progress — API Layer & End-to-End Flow

### ✅ Completed
- Built API endpoint: `POST /api/assets`
- Implemented controller (`createAsset`) and routing
- Added file upload using multer

### 🔗 End-to-End Flow
Upload file → generate SHA-256 hash → upload to IPFS → create metadata → save to DB (pending) → call smart contract mint → update DB (active)

### ⛓️ Blockchain Integration
- Integrated ethers.js in backend
- Called `safeMint()`
- Parsed transaction receipt to extract `tokenId` from events

### 🧱 Architecture
Controller → Service → (DB + IPFS + Blockchain)

### 🐞 Debugging & Fixes
- Hardhat dependency/version issues
- ES modules vs CommonJS
- ABI/RPC configuration
- DB issues (UUID, not-null, schema mismatches)

### ⚠️ Pending
- Fix `issued_by` DB mismatch (blocking edge case)

### 🚧 Next Step
- Complete verification API
- Add input validation & error handling
- Improve DB consistency checks