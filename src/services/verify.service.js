import Asset from "../models/asset.model.js";
import { verifyOnChain } from "../config/blockchain.js";

async function verifyAssetService(tokenId) {
    const asset = await Asset.findOne({
        where: {
            token_id: String(tokenId),
        },
        order: [
            ["created_at", "DESC"],
        ],
    });

    if (!asset) {
        throw new Error("Asset not found");
    }

    if (asset.status !== "active") {
        return {
            verified: false,
            reason: "Asset is not active",
            asset,
        };
    }

    if (asset.expiry_date && new Date(asset.expiry_date) < new Date()) {
        return {
            verified: false,
            reason: "Asset expired",
            asset,
        };
    }

    const chain = await verifyOnChain(tokenId);

    if (asset.metadata_uri !== chain.metadataURI) {
        return {
            verified: false,
            reason: "Metadata mismatch",
            asset: {
                token_id: asset.token_id,
                title: asset.title,
                status: asset.status,
                metadata_uri: asset.metadata_uri,
            },
            blockchain: chain,
        };
    }

    return {
        verified: true,
        asset: {
            token_id: asset.token_id,
            title: asset.title,
            issuer: asset.issued_by,
            status: asset.status,
            issued_at: asset.issued_at,
            expiry_date: asset.expiry_date,
            similarity_score: asset.similarity_score,
        },
        blockchain: {
            owner: chain.owner,
            metadata_uri: chain.metadataURI,
            tx_hash: asset.tx_hash,
        },
    };
}

export { verifyAssetService };
