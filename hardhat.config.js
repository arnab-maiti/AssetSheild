import "dotenv/config";
import { defineConfig } from "hardhat/config";
import hardhatEthers from "@nomicfoundation/hardhat-ethers";

const sepoliaUrl = process.env.SEPOLIA_RPC_URL;
const accounts = process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [];

export default defineConfig({
  plugins: [hardhatEthers],
  solidity: "0.8.28",
  networks: {
    ...(sepoliaUrl
      ? {
          sepolia: {
            type: "http",
            chainType: "l1",
            url: sepoliaUrl,
            accounts,
          },
        }
      : {}),
  },
});