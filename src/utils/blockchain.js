import "dotenv/config";
import { ethers } from "ethers";
import assetArtifact from "../abi/Asset.json" with { type: "json" };

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contract = new ethers.Contract(
    process.env.CONTRACT_ADDRESS,
    assetArtifact.abi,
    wallet
);

export { contract, provider, wallet };
