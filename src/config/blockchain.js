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
        const signerAddress = await assetContract.runner.getAddress();
        const deployedCode = await assetContract.runner.provider.getCode(assetContract.target);

        if (deployedCode === "0x") {
            throw new Error(`No Asset contract deployed at ${assetContract.target} on the configured RPC network`);
        }

        const isAuthorized = await assetContract.authorizedMinters(signerAddress);

        if (!isAuthorized) {
            throw new Error(
                `Wallet ${signerAddress} is not authorized to mint on contract ${assetContract.target}. ` +
                `Run addMinter(${signerAddress}) from the contract owner account.`
            );
        }

        const expectedTokenId = await assetContract.safeMint.staticCall(to, metadataURI);
        const tx = await assetContract.safeMint(to, metadataURI);
        console.log("Transaction sent:", tx.hash);

        const receipt = await tx.wait();
        console.log("Transaction confirmed");

        let tokenId = null;

        for (const log of receipt.logs) {
            if (log.address.toLowerCase() !== assetContract.target.toLowerCase()) {
                continue;
            }

            try {
                const parsedLog = assetContract.interface.parseLog(log);

                if (parsedLog?.name === "AssetMinted") {
                    tokenId = (parsedLog.args.tokenId ?? parsedLog.args[0]).toString();
                    break;
                }

                if (parsedLog?.name === "Transfer") {
                    const from = parsedLog.args.from ?? parsedLog.args[0];
                    const mintedTokenId = parsedLog.args.tokenId ?? parsedLog.args[2];

                    if (from === ethers.ZeroAddress) {
                        tokenId = mintedTokenId.toString();
                        break;
                    }
                }
            } catch {
                const transferTopic = ethers.id("Transfer(address,address,uint256)");
                const zeroAddressTopic = ethers.zeroPadValue(ethers.ZeroAddress, 32);

                if (log.topics[0] === transferTopic && log.topics[1] === zeroAddressTopic && log.topics[3]) {
                    tokenId = BigInt(log.topics[3]).toString();
                    break;
                }
            }
        }

        tokenId ??= expectedTokenId.toString();

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
async function verifyOnChain(tokenId) {
    try {
        const assetContract = getContract();
        const owner = await assetContract.ownerOf(tokenId);
        const metadataURI = await assetContract.tokenURI(tokenId);

        return {
            owner,
            metadataURI,
        };
    } catch (error) {
        throw new Error(`Blockchain verification failed: ${error.message}`);
    }
}

export { getContract, mintNFT, verifyOnChain };
