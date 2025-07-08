const { ethers } = require("hardhat");

module.exports = async function () {
  const [deployer] = await ethers.getSigners();
  console.log("部署账户:", deployer.address);

  const NFTAuctionUUPS = await ethers.getContractFactory("UUPS/NFTAuctionUUPS");
  const nftAuctionUUPS = await NFTAuctionUUPS.deploy();
  await nftAuctionUUPS.waitForDeployment();
  console.log("NFTAuctionUUPS 实现合约部署地址:", await nftAuctionUUPS.getAddress());
}; 

module.exports.tags = ['nftAuctionUUPS'];