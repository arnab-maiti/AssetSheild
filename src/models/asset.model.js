import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Asset = sequelize.define("Asset", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },

    title: {
        type: DataTypes.TEXT,
        allowNull: false,
    },

    description: {
        type: DataTypes.TEXT,
    },

    owner_name: {
        type: DataTypes.TEXT,
    },

    document_hash: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
    },

    ipfs_url: {
        type: DataTypes.TEXT,
        allowNull: false,
    },

    metadata_uri: {
        type: DataTypes.TEXT,
    },

    status: {
        type: DataTypes.TEXT,
        defaultValue: "pending_mint",
        validate: {
            isIn: [[
                "pending_mint",
                "active",
                "revoked",
                "expired",
                "mint_failed",
            ]],
        },
    },

    issued_by: {
        type: DataTypes.UUID,
        allowNull: false,
    },

    issued_at: {
        type: DataTypes.DATE,
    },

    expiry_date: {
        type: DataTypes.DATE,
    },

    similarity_score: {
        type: DataTypes.FLOAT,
    },

    token_id: {
        type: DataTypes.TEXT,
    },

    tx_hash: {
        type: DataTypes.TEXT,
    },

    is_duplicate: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },

    verification_url: {
        type: DataTypes.TEXT,
    },

    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },

}, {
    tableName: "assets",
    timestamps: false, // because you manually handled created_at
});

export default Asset;
