const { ethers } = require("hardhat");

/**
 * npx hardhat deploy --tags onePieceNFT
 */
module.exports = async function () {
  const [deployer] = await ethers.getSigners();
  console.log("部署账户:", deployer.address);

  const OnePieceNFT = await ethers.getContractFactory("OnePieceNFT");
  const onePieceNFT = await OnePieceNFT.deploy();
  await onePieceNFT.waitForDeployment();
  console.log("OnePieceNFT 部署地址:", await onePieceNFT.getAddress());
}; 

module.exports.tags = ['onePieceNFT'];