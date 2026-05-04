## 📅 Day 3 Progress — Backend ↔ Blockchain Integration

### ✅ Completed
- Deployed ERC-721 contract on Sepolia
- Integrated smart contract with backend (Node.js)
- Configured RPC connection and wallet signer
- Connected contract using ABI + address

### ⚙️ Backend Implementation
- Created blockchain utility module (`utils/blockchain.js`)
- Implemented `mintNFT()` flow:
  - Call contract → send transaction → wait for confirmation
  - Parse transaction receipt → extract event logs

### 🔍 Key Insight
- `tokenId` is not returned directly
- Extracted from emitted events in transaction logs

### 🔐 Features Used
- Authorized minter logic
- Soulbound NFT behavior
- Event-driven mint tracking

### 🚧 Next Step
- Build API endpoints for minting & verification
- Store tokenId + txHash in database