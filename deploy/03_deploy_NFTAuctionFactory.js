const { ethers, upgrades } = require("hardhat");

module.exports = async function () {
  const [deployer] = await ethers.getSigners();
  console.log("部署账户:", deployer.address);

  // 需要先部署 NFTAuction 实现合约，并将地址填入此处
  const nftAuctionImplementation = process.env.NFT_AUCTION_IMPL;
  if (!nftAuctionImplementation) {
    throw new Error("请设置 NFT_AUCTION_IMPL 环境变量为 NFTAuction 实现合约地址");
  }

  const NFTAuctionFactory = await ethers.getContractFactory("NFTAuctionFactory");
  // 透明代理部署
  const nftAuctionFactory = await upgrades.deployProxy(
    NFTAuctionFactory,
    [nftAuctionImplementation],
    { initializer: "initialize" }
  );
  await nftAuctionFactory.waitForDeployment();
  console.log("NFTAuctionFactory 透明代理部署地址:", await nftAuctionFactory.getAddress());
};

module.exports.tags = ['nftAuctionFactory'];