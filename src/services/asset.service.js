import { mintNFT } from "../config/blockchain.js";
import Asset from "../models/asset.model.js";
import Authority from "../models/authority.model.js";
import { generateHash } from "../utils/hash.js";
import { uploadFileToIPFS, uploadMetadataToIPFS } from "../utils/ipfs.js";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function getIssuerName(data) {
    return (data.issuer || data.issuerName || data.issuer_name || "Authority").trim();
}

async function resolveIssuedBy(data) {
    if (data.issued_by && UUID_PATTERN.test(data.issued_by)) {
        return data.issued_by;
    }

    const issuerName = getIssuerName(data);
    const [authority] = await Authority.findOrCreate({
        where: { name: issuerName },
        defaults: {
            name: issuerName,
            wallet_address: data.issuerWalletAddress || data.issuer_wallet_address || null,
            role: data.issuerRole || data.issuer_role || "issuer",
            created_at: new Date(),
        },
    });

    return authority.id;
}

async function createAssetService(file, data) {
    try {
        // 1. Generate hash
        const documentHash = generateHash(file.buffer);
        const existingAsset = await Asset.findOne({
            where: { document_hash: documentHash },
        });

        if (existingAsset) {
            const error = new Error("A document with this hash has already been uploaded");
            error.name = "DuplicateAssetError";
            throw error;
        }

        const issuerName = getIssuerName(data);
        const issuedBy = await resolveIssuedBy(data);

        // 2. Upload file to IPFS
        const fileUrl = await uploadFileToIPFS(file);

        // 3. Create metadata
        const metadata = {
            name: data.title,
            description: "Asset Verification Document",
            document_hash: documentHash,
            file_url: fileUrl,
            issuer: issuerName,
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
            issued_by: issuedBy,
            issued_at: new Date(),
            expiry_date: data.expiryDate || data.expiry_date,
            status: "pending_mint",
        });

        // 6. Mint NFT
        let tokenId;
        let txHash;

        try {
            ({ tokenId, txHash } = await mintNFT(
                data.walletAddress,
                metadataURI
            ));
        } catch (error) {
            asset.status = "mint_failed";
            await asset.save();
            throw error;
        }

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
