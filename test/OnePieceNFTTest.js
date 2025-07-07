const { expect } = require("chai");
const { ethers } = require("hardhat");

const ZORO_JSON_CID = "bafkreic65r34quampjfso5txnch4rezmpznhefuor3va773iftgt3sdeqa"


describe("OnePieceNFT", function () {
  let OnePieceNFT, onePieceNFT, owner;

  /**
   * If use `beforeEach` here, it will deploy a new contract before each test.
   * So we use `before` to deploy the contract only once before all tests.
   */
  before(async function () {
    // deploy contract
    [owner] = await ethers.getSigners();
    OnePieceNFT = await ethers.getContractFactory("OnePieceNFT");
    onePieceNFT = await OnePieceNFT.deploy();
    await onePieceNFT.waitForDeployment();
  });

  // verify - admin if setup correctly
  it("should have correct basic info", async function () {
    expect(await onePieceNFT.name()).to.equal("OnePieceNFT");
    expect(await onePieceNFT.symbol()).to.equal("OPNFT");
    expect(await onePieceNFT.nextTokenId()).to.equal(0);
  });

  it("success mint ECR721", async function () {
    const tokenURI = ZORO_JSON_CID;
    const tx = await onePieceNFT.mintNFT(owner.address, tokenURI);
    await tx.wait();
    console.log("NFT Address:", tx);
    // 检查NFT是否成功铸造
    expect(await onePieceNFT.ownerOf(0)).to.equal(owner.address);
    expect(await onePieceNFT.nextTokenId()).to.equal(1);
  });

  /**
   * Why nextTokenId here is 0
   * Because we `beforeEach` before
   */
  it("nextTokenId should add one", async function () {
    console.log("Current nextTokenId:", (await onePieceNFT.nextTokenId()).toString());
    expect(await onePieceNFT.nextTokenId()).to.equal(1);
  });


});