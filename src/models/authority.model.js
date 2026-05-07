import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Authority = sequelize.define("Authority", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },

    name: {
        type: DataTypes.TEXT,
        allowNull: false,
    },

    wallet_address: {
        type: DataTypes.TEXT,
        unique: true,
    },

    role: {
        type: DataTypes.TEXT,
        defaultValue: "issuer",
    },

    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: "authorities",
    timestamps: false,
});

export default Authority;
