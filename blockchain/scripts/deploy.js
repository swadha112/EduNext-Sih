// scripts/deploy.js
async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    // Get the contract factory for UserRegistry
    const UserRegistry = await ethers.getContractFactory("UserRegistry");

    console.log("Deploying contract...");
    const userRegistry = await UserRegistry.deploy();

    console.log("Contract deployment initiated...");

    // Ensure the deployment was successful and log the contract instance
    if (userRegistry && userRegistry.deployTransaction) {
        console.log("Transaction Hash:", userRegistry.deployTransaction.hash);

        // Wait for the transaction to be mined and get the receipt
        const txReceipt = await userRegistry.deployTransaction.wait();
        console.log("Contract deployed successfully!");
        console.log("Contract address:", userRegistry.address);  // Log the deployed address
        console.log("Transaction mined in block:", txReceipt.blockNumber);  // Show the block number the contract was mined in
    } else {
        console.error("Deployment failed, no transaction hash found.");
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
