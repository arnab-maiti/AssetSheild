import { mintNFT } from "../config/blockchain.js";
import Asset from "../models/asset.model.js";
import { generateHash } from "../utils/hash.js";
import { uploadFileToIPFS, uploadMetadataToIPFS } from "../utils/ipfs.js";

async function createAssetService(file, data) {
    try {
        // 1. Generate hash
        const documentHash = generateHash(file.buffer);

        // 2. Upload file to IPFS
        const fileUrl = await uploadFileToIPFS(file);

        // 3. Create metadata
        const metadata = {
            name: data.title,
            description: "Asset Verification Document",
            document_hash: documentHash,
            file_url: fileUrl,
            issuer: data.issuer || "Authority",
            timestamp: new Date().toISOString(),
        };

        // 4. Upload metadata
        const metadataURI = await uploadMetadataToIPFS(metadata);

        // 5. Save to DB (pending state)
        const asset = await Asset.create({
            title: data.title,
            description: data.description,
            owner_name: data.ownerName || data.owner_name,
            document_hash: documentHash,
            ipfs_url: fileUrl,
            metadata_uri: metadataURI,
            issued_by: data.issuedBy || data.issued_by,
            issued_at: new Date(),
            expiry_date: data.expiryDate || data.expiry_date,
            status: "pending_mint",
        });

        // 6. Mint NFT
        const { tokenId, txHash } = await mintNFT(
            data.walletAddress,
            metadataURI
        );

        // 7. Update DB
        asset.token_id = tokenId;
        asset.tx_hash = txHash;
        asset.status = "active";

        await asset.save();

        return asset;

    } catch (error) {
        console.error("Create Asset Error:", error.message);
        throw error;
    }
}

export { createAssetService };
