require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");

require("@openzeppelin/hardhat-upgrades")
require("dotenv").config(); // 加载 .env 文件
console.log("ALCHEMY_API_KEY:", process.env.ALCHEMY_API_KEY);
console.log("PRIVATE_KEY:", process.env.PRIVATE_KEY);

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  // networks:{
  //   sepolia: {
  //     // url: "https://eth-sepolia.g.alchemy.com/v2/" + process.env.ALCHEMY_API_KEY,
  //     url: "https://sepolia.infura.io/v3/" + process.env.INFURA_ID,
  //     accounts: [`0x${process.env.PRIVATE_KEY}`] //Replace with your wallet private key
  //   },
  // }
};






