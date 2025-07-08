const { ethers, upgrades } = require("hardhat");

module.exports = async function () {
  // 代理合约地址，需替换为实际部署的 NFTAuctionFactory 代理地址
  const proxyAddress = process.env.NFT_AUCTION_FACTORY_PROXY;
  if (!proxyAddress) {
    throw new Error("请设置 NFT_AUCTION_FACTORY_PROXY 环境变量为 NFTAuctionFactory 代理合约地址");
  }

  // 新的实现合约工厂（如升级为 V2 版本）
  const NFTAuctionFactoryV2 = await ethers.getContractFactory("NFTAuctionFactoryV2");

  // 执行升级
  const upgraded = await upgrades.upgradeProxy(proxyAddress, NFTAuctionFactoryV2);
  await upgraded.waitForDeployment();
  console.log("NFTAuctionFactory 透明代理升级完成，新实现合约地址:", await upgrades.erc1967.getImplementationAddress(proxyAddress));
}; 