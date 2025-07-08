const { ethers } = require("hardhat");

/**
 * 部署账户: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
   NFTAuction 实现合约部署地址: 0x5FbDB2315678afecb367f032d93F642f64180aa3
 */
module.exports = async function () {
  const [deployer] = await ethers.getSigners();
  console.log("部署账户:", deployer.address);

  const NFTAuction = await ethers.getContractFactory("NFTAuction");
  const nftAuction = await NFTAuction.deploy();
  await nftAuction.waitForDeployment();
  console.log("NFTAuction 实现合约部署地址:", await nftAuction.getAddress());
}; 

module.exports.tags = ['nftAuction'];