require("@nomicfoundation/hardhat-ethers");
require("dotenv").config();

module.exports = {
    solidity: "0.8.28",
    networks: {
        sepolia: {
            url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
            accounts: [`0x${process.env.PRIVATE_KEY}`],
        },
        localhost: {
            url: "http://127.0.0.1:8545",
        },
    },
};
