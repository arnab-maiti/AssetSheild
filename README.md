# 🛡️ AssetShield
### Blockchain-Based Digital Asset Verification & Trust Management Platform

**Verify Authenticity. Preserve Evidence. Build Trust.**

AssetShield is a blockchain-powered digital asset verification platform designed to establish the authenticity, integrity, and traceability of important digital documents.

It combines traditional backend engineering, cryptographic hashing, decentralized storage, and blockchain technology to create a transparent and verifiable asset management system.

The platform allows authorized issuers to upload documents, generate cryptographic fingerprints, store documents on IPFS, mint NFT-based digital representations, and verify asset authenticity through blockchain records.

---

## 📌 Table of Contents

- Overview
- Problem Statement
- Key Features
- System Architecture
- Technology Stack
- Project Structure
- How It Works
- Database Design
- Smart Contract Integration
- API Documentation
- Asset Lifecycle Management
- Audit & Event Tracking
- Installation & Setup
- Environment Variables
- Running the Project
- Testing
- Security Considerations
- Roadmap
- Future Improvements
- Author

---

## 🎯 Overview

Traditional document verification systems often depend on centralized databases and manual verification processes.

These systems can face challenges such as:
- Document forgery and duplication.
- Unauthorized modifications.
- Lack of transparent verification history.
- Difficulty tracking revoked or expired documents.
- Dependence on a centralized authority.

AssetShield addresses these challenges by combining:

1. **SHA-256:** Generates a unique cryptographic fingerprint for uploaded documents.
2. **IPFS:** Stores documents and metadata using decentralized storage.
3. **NFTs:** Represents verified digital assets on the blockchain.
4. **Smart Contracts:** Maintains on-chain ownership and metadata references.
5. **PostgreSQL:** Stores structured asset information and application records.
6. **Audit Events:** Tracks important asset lifecycle changes.

---

## ✨ Key Features

### 1. Digital Asset Registration
- Upload digital documents.
- Generate SHA-256 document hashes.
- Store asset information in PostgreSQL.
- Associate assets with authorized issuers.

### 2. Decentralized Storage
- Upload documents to IPFS through Pinata.
- Generate IPFS file URLs.
- Store metadata separately on IPFS.
- Maintain metadata references in the database.

### 3. NFT-Based Asset Representation
- Mint NFTs using Solidity smart contracts.
- Associate NFT token IDs with digital assets.
- Store transaction hashes.
- Track blockchain ownership.

### 4. Blockchain Verification
- Verify NFT ownership.
- Retrieve metadata URI.
- Compare blockchain records with database records.
- Return structured verification information.

### 5. Asset Lifecycle Management

Supported asset statuses:

| Status | Description |
|---|---|
| pending_mint | Asset registered and awaiting minting |
| active | Asset is valid and active |
| expired | Asset validity period has ended |
| revoked | Asset has been revoked |
| suspended | Asset temporarily suspended |
| fraud_detected | Potential fraud identified |
| mint_failed | NFT minting failed |

The system uses controlled status transitions to prevent invalid lifecycle changes.

### 6. Audit & Event Tracking
- Track asset status changes.
- Record previous and updated statuses.
- Associate events with the responsible authority.
- Store event metadata in PostgreSQL JSONB.
- Maintain a history of important asset operations.

### 7. Duplicate Detection

**Planned / under development**

- Compare SHA-256 document hashes.
- Detect exact duplicate uploads.
- Prevent duplicate NFT minting.
- Record duplicate detection events.

---

## 🏗️ System Architecture

```text
                 CLIENT
                   |
                   v
             EXPRESS API
                   |
          -------------------
          |                 |
          v                 v
     Controllers         Middleware
          |
          v
       Services
          |
    ---------------------
    |         |         |
    v         v         v
 PostgreSQL  IPFS    Blockchain
    |         |         |
    v         v         v
 Asset     Document   Solidity
 Records   Storage    Smart Contract
    |
    v
 Asset Events
 Audit History
```

### Core Architecture Principles

- Separation of concerns.
- Controller-Service architecture.
- Centralized business logic.
- Database-backed asset management.
- Decentralized document storage.
- Blockchain-based ownership verification.
- Event-based lifecycle tracking.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| Node.js | Backend runtime |
| Express.js | REST API framework |
| JavaScript (ES Modules) | Backend development |
| PostgreSQL | Relational database |
| Sequelize | ORM |
| Solidity | Smart contract development |
| Hardhat | Smart contract compilation and deployment |
| Ethers.js v6 | Blockchain interaction |
| IPFS | Decentralized file storage |
| Pinata | IPFS upload and gateway |
| SHA-256 | Document integrity verification |
| Postman | API testing |
| Sepolia | Ethereum test network |

---

## 📂 Project Structure

```text
AssetShield/
│
├── contracts/
│   └── Asset.sol
│
├── scripts/
│   └── deploy.js
│
├── test/
│
├── abi/
│   └── Asset.json
│
├── src/
│   │
│   ├── config/
│   │   ├── db.js
│   │   └── blockchain.js
│   │
│   ├── controllers/
│   │   ├── asset.controller.js
│   │   ├── verification.controller.js
│   │   └── updateStatus.controller.js
│   │
│   ├── models/
│   │   ├── asset.model.js
│   │   ├── assetEvent.model.js
│   │   └── authority.model.js
│   │
│   ├── routes/
│   │   ├── asset.routes.js
│   │   ├── verification.routes.js
│   │   └── updateStatus.routes.js
│   │
│   ├── services/
│   │   ├── createAsset.service.js
│   │   ├── verification.service.js
│   │   ├── updateStatus.service.js
│   │   └── event.service.js
│   │
│   ├── utils/
│   │   ├── hash.js
│   │   ├── ipfs.js
│   │   └── status.js
│   │
│   └── app.js
│
├── server.js
├── hardhat.config.js
├── package.json
├── .env
└── README.md
```

*Note: This is the intended logical structure. Adjust filenames to match the actual files in your repository.*

---

## ⚙️ How It Works

### Step 1: Document Upload

An authorized issuer uploads a document through the backend API.

### Step 2: Generate Document Hash

The backend generates a SHA-256 hash using the uploaded file buffer.

Example:

```text
Document:
certificate.pdf

SHA-256:
7041633d5969bedf183dd572aa22e172...
```

This hash acts as the document's cryptographic fingerprint.

### Step 3: Upload to IPFS

The original document is uploaded to IPFS using Pinata.

The backend receives an IPFS URL.

### Step 4: Generate Metadata

Asset metadata is generated containing:

- Document hash
- IPFS file URL
- Issuer information
- Timestamp
- Asset information

The metadata is also uploaded to IPFS.

### Step 5: Create Database Record

The asset is registered in PostgreSQL with an initial status of `pending_mint`.

### Step 6: Mint NFT

The backend communicates with the Solidity smart contract using Ethers.js.

The NFT is minted to the supplied wallet address.

### Step 7: Update Database

After successful blockchain confirmation, the backend updates the asset with:

- Token ID
- Transaction hash
- Metadata URI
- Active status

### Step 8: Verification

The verification service retrieves blockchain information and compares it with the database record.

The result provides asset information and blockchain ownership details.

---

## 🗄️ Database Design

AssetShield uses PostgreSQL for structured application data.

### 1. authorities

Stores authorized issuers.

| Column | Description |
|---|---|
| id | UUID primary key |
| name | Authority name |
| wallet_address | Blockchain wallet |
| role | Authority role |
| created_at | Registration timestamp |

### 2. assets

Stores registered digital assets.

| Column | Description |
|---|---|
| id | UUID primary key |
| title | Asset title |
| description | Asset description |
| owner_name | Asset owner |
| document_hash | SHA-256 hash |
| ipfs_url | Document IPFS URL |
| status | Current lifecycle status |
| issued_by | Authority UUID |
| issued_at | Issuance timestamp |
| expiry_date | Expiration date |
| similarity_score | Similarity score |
| is_duplicate | Duplicate indicator |
| verification_url | Verification URL |
| created_at | Creation timestamp |

### 3. nft_tokens

Stores blockchain NFT information.

| Column | Description |
|---|---|
| id | UUID primary key |
| asset_id | Associated asset |
| token_id | NFT token ID |
| contract_address | Smart contract address |
| mint_tx_hash | Mint transaction hash |
| metadata_uri | IPFS metadata URI |
| minted_at | Mint timestamp |

### 4. asset_events

Stores asset lifecycle history.

| Column | Description |
|---|---|
| id | UUID primary key |
| asset_id | Associated asset |
| event_type | Event category |
| performed_by | Actor identifier |
| metadata | JSONB event information |
| created_at | Event timestamp |

Example event metadata:

```json
{
  "old_status": "active",
  "new_status": "suspended"
}
```

### 5. risk_scores

Stores asset risk assessment information.

### 6. verification_logs

Stores verification attempts, IP information, results, and suspicious activity indicators.

---

## 🔗 Smart Contract Integration

AssetShield uses a Solidity smart contract to represent digital assets as NFTs.

### Main Operations

- Mint digital asset NFTs.
- Associate token IDs with metadata URIs.
- Retrieve token ownership.
- Retrieve token metadata.
- Enforce authorized minting.

### Blockchain Interaction

The backend uses Ethers.js v6.

Example:

```javascript
const owner = await contract.ownerOf(tokenId);
```

Minting flow:

```text
Backend
   |
   v
Ethers.js
   |
   v
Smart Contract
   |
   v
safeMint()
   |
   v
Transaction Confirmation
   |
   v
Token ID + Transaction Hash
```

The project currently supports local blockchain development and Sepolia testnet deployment.

---

## 🔌 API Documentation

Base URL:

```text
http://localhost:5000
```

### 1. Health Check

```http
GET /api/health
```

Checks backend availability.

### 2. Create Asset

The asset creation workflow accepts document upload and asset information.

Expected information includes:

- title
- walletAddress
- issuer
- document file

The endpoint uses multipart/form-data.

### 3. Verify Asset

The verification workflow retrieves asset information and blockchain verification details.

The response can include:

```json
{
  "success": true,
  "data": {
    "verified": true,
    "asset": {
      "token_id": "2",
      "title": "Udemy",
      "status": "active"
    },
    "blockchain": {
      "owner": "0x...",
      "metadata_uri": "https://...",
      "tx_hash": "0x..."
    }
  }
}
```

### 4. Update Asset Status

```http
PATCH /api/assets/:id/status
```

Request:

```json
{
  "newStatus": "suspended"
}
```

Successful response:

```json
{
  "success": true,
  "message": "Asset status updated successfully"
}
```

The service validates the requested status and allowed transitions before updating the database.

*Additional endpoint paths should be documented against the actual registered routes in the repository.*

---

## 🔄 Asset Lifecycle Management

AssetShield implements a Finite State Machine (FSM) for lifecycle management.

Example:

```text
           ACTIVE
          /  |  \
         /   |   \
        v    v    v
    EXPIRED REVOKED SUSPENDED
                         |
                         v
                       ACTIVE
```

The backend validates transitions before updating the asset.

Invalid transitions are rejected.

This helps maintain consistent asset states.

---

## 📜 Audit & Event Tracking

AssetShield separates current asset state from historical events.

```text
assets
  |
  | Current state
  v
status = suspended

asset_events
  |
  | Historical records
  v
active → suspended
```

Whenever an asset status is updated, the backend creates an event record.

This provides traceability and supports future compliance and analytics functionality.

---

## 🚀 Installation & Setup

### Prerequisites

Install:

- Node.js
- npm
- PostgreSQL
- Git
- Hardhat
- Postman

You also need:

- Pinata account
- Ethereum Sepolia RPC endpoint
- Testnet wallet with Sepolia ETH

### 1. Clone Repository

```bash
git clone YOUR_REPOSITORY_URL
cd AssetShield
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure PostgreSQL

Create a database:

```sql
CREATE DATABASE assetshield;
```

Configure the database connection in your environment variables.

Create the required tables using your database schema or migrations.

### 4. Configure Environment Variables

Create a `.env` file in the project root.

```env
PORT=5000

DATABASE_URL=your_postgresql_connection_string

RPC_URL=your_sepolia_rpc_url

PRIVATE_KEY=your_wallet_private_key

CONTRACT_ADDRESS=your_deployed_contract_address

PINATA_API_KEY=your_pinata_api_key

PINATA_SECRET_API_KEY=your_pinata_secret_key
```

Use the exact environment variable names expected by your existing configuration files.

**Never commit your `.env` file or expose private keys.**

### 5. Compile Smart Contracts

```bash
npx hardhat compile
```

### 6. Deploy Smart Contract

For local development:

```bash
npx hardhat node
```

In another terminal, run your deployment script using the local network configuration.

For Sepolia, use your configured Sepolia network deployment command.

Update `CONTRACT_ADDRESS` after deployment.

### 7. Start Backend

```bash
node server.js
```

Expected output:

```text
Server running on port 5000
```

---

## 🧪 Testing

Use Postman to test the backend APIs.

Recommended test cases:

| Test | Expected Result |
|---|---|
| Health check | Successful response |
| Valid document upload | Asset creation |
| Successful NFT mint | Token ID returned |
| Blockchain verification | Ownership information returned |
| Invalid asset ID | Appropriate error |
| Valid status transition | Status updated |
| Invalid status transition | Request rejected |
| Status update event | Event stored in database |
| Duplicate document | Duplicate rejected (once implemented) |

---

## 🔐 Security Considerations

Security is an important part of AssetShield.

Current and planned security measures include:

- Cryptographic document hashing.
- Smart contract authorization.
- Database constraints.
- Controlled asset status transitions.
- Private key protection.
- Environment-based configuration.
- Event history tracking.
- Duplicate document prevention.
- Role-based access control.
- API rate limiting and request validation.

Blockchain transactions are public and generally irreversible. Sensitive personal document contents should not be placed directly on-chain.

---

## 🗺️ Development Roadmap

| Phase | Feature | Status |
|---|---|---|
| 1 | Project setup and backend foundation | Completed |
| 2 | PostgreSQL database integration | Completed |
| 3 | Document hashing and IPFS integration | Completed |
| 4 | NFT minting and blockchain integration | Completed |
| 5 | Asset verification | Completed |
| 6 | Asset lifecycle management and FSM | Completed |
| 7 | Asset event and audit tracking | Completed |
| 8 | Exact duplicate detection | Under development |
| 9 | Advanced fraud detection | Planned |
| 10 | Role-based authentication | Planned |
| 11 | Verification history and analytics | Planned |
| 12 | QR-based verification | Planned |
| 13 | Frontend dashboard | Planned |
| 14 | Production deployment | Planned |

*Feature status reflects the development progress documented in this project README, not an independent code audit.*

---

## 🔮 Future Improvements

Potential future enhancements include:

1. AI-powered document similarity detection.
2. Advanced fraud detection and risk scoring.
3. QR-code-based public verification.
4. Issuer and administrator dashboards.
5. Role-based authentication and authorization.
6. Automated asset expiration.
7. Comprehensive verification history.
8. Production deployment and monitoring.
9. Blockchain event indexing.
10. Improved transaction failure recovery.

---

## 💡 Why AssetShield?

AssetShield is designed to demonstrate how multiple technologies can work together to solve a real-world trust problem.

Rather than relying entirely on blockchain, it combines:

- Backend engineering for business logic.
- PostgreSQL for structured records.
- Cryptography for document integrity.
- IPFS for decentralized storage.
- Smart contracts for blockchain verification.
- Event tracking for accountability.

The goal is to create a reliable and extensible digital asset trust infrastructure.

---

## 👨‍💻 Author

**Arnab Maiti**

B.Tech Information Technology Student

Interests:
- Backend Engineering
- Blockchain Technology
- Distributed Systems
- Scalable API Development
- System Design

GitHub: https://github.com/arnab-maiti

---

## 📄 License

This project is currently under development. Add an appropriate open-source license before distributing it publicly.