const hre = require("hardhat");

async function main() {
    // Get the contract factory
    const UserHashRegistry = await hre.ethers.getContractFactory("UserHashRegistry");

    // Deploy the contract and get the contract instance
    const userHashRegistry = await UserHashRegistry.deploy();
    
    // Log the userHashRegistry object
    console.log("userHashRegistry:", userHashRegistry);

    // Ensure the transaction is returned
    if (!userHashRegistry.deployTransaction) {
        throw new Error("Deployment transaction not found");
    }

    // Wait for the transaction to be mined (get the receipt)
    const txReceipt = await userHashRegistry.deployTransaction.wait();

    // Log the transaction receipt and contract address
    console.log("Transaction Receipt:", txReceipt);
    console.log("Contract deployed to:", userHashRegistry.address);
}

// Run the script
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
