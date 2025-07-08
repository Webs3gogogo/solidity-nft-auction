const { ethers, upgrades } = require("hardhat");

module.exports = async function () {
  const [deployer] = await ethers.getSigners();
  console.log("部署账户:", deployer.address);

  // 需要先部署 NFTAuctionUUPS 实现合约，并将地址填入此处
  const nftAuctionUUPSImpl = process.env.NFT_AUCTION_UUPS_IMPL;
  if (!nftAuctionUUPSImpl) {
    throw new Error("请设置 NFT_AUCTION_UUPS_IMPL 环境变量为 NFTAuctionUUPS 实现合约地址");
  }

  const NFTAuctionFactoryUUPS = await ethers.getContractFactory("UUPS/NFTAuctionFactoryUUPS");
  const nftAuctionFactoryUUPS = await upgrades.deployProxy(
    NFTAuctionFactoryUUPS,
    [nftAuctionUUPSImpl],
    { initializer: "initialize", kind: "uups" }
  );
  await nftAuctionFactoryUUPS.waitForDeployment();
  console.log("NFTAuctionFactoryUUPS 代理合约部署地址:", await nftAuctionFactoryUUPS.getAddress());
}; 

module.exports.tags = ['nftAuctionFactoryUUPS'];