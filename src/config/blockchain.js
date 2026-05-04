import "dotenv/config";
import { createRequire } from "node:module";
import { ethers } from "ethers";

const require = createRequire(import.meta.url);
const contractABI = require("../abi/Asset.json").abi;

let contract;

function requireEnv(name, value) {
    if (!value) {
        throw new Error(`${name} is required in the environment`);
    }

    return value;
}

function getContract() {
    if (contract) {
        return contract;
    }

    const rpcUrl = requireEnv("RPC_URL", process.env.RPC_URL || process.env.SEPOLIA_RPC_URL);
    const privateKey = requireEnv("PRIVATE_KEY", process.env.PRIVATE_KEY);
    const contractAddress = requireEnv("CONTRACT_ADDRESS", process.env.CONTRACT_ADDRESS);

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    contract = new ethers.Contract(contractAddress, contractABI, wallet);

    return contract;
}

async function mintNFT(to, metadataURI) {
    try {
        const assetContract = getContract();
        const tx = await assetContract.safeMint(to, metadataURI);
        console.log("Transaction sent:", tx.hash);

        const receipt = await tx.wait();
        console.log("Transaction confirmed");

        let tokenId = null;

        for (const log of receipt.logs) {
            try {
                const parsedLog = assetContract.interface.parseLog(log);

                if (parsedLog?.name === "AssetMinted") {
                    tokenId = parsedLog.args.tokenId.toString();
                    break;
                }
            } catch {
                // Ignore logs that are not from this contract.
            }
        }

        if (!tokenId) {
            throw new Error("TokenId not found in events");
        }

        return {
            tokenId,
            txHash: tx.hash,
        };
    } catch (error) {
        console.error("Mint NFT Error:", error.message);
        throw error;
    }
}

export { getContract, mintNFT };
