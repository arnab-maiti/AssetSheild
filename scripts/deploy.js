import { network } from "hardhat";

async function main() {
    const { ethers } = await network.create();
    const [deployer] = await ethers.getSigners();
    const deployerAddress = await deployer.getAddress();
    const initialOwner = process.env.INITIAL_OWNER ?? deployerAddress;
    const balance = await ethers.provider.getBalance(deployerAddress);

    console.log("Deploying from:", deployerAddress);
    console.log("Network:", (await ethers.provider.getNetwork()).name);
    console.log("Balance:", ethers.formatEther(balance));

    if (balance === 0n) {
        throw new Error(
            "Deploy wallet has 0 native tokens. Fund the PRIVATE_KEY wallet for the selected network, then retry."
        );
    }

    const contract = await ethers.deployContract("Asset", [
        initialOwner,
    ]);

    await contract.waitForDeployment();

    console.log("Contract deployed to:", contract.target);
    console.log("Initial owner:", initialOwner);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
