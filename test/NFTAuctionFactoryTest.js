const { expect } = require("chai");
const { ethers,upgrades} = require("hardhat");
const {  } = require('@openzeppelin/hardhat-upgrades');
const ZORO_JSON_CID = "bafkreic65r34quampjfso5txnch4rezmpznhefuor3va773iftgt3sdeqa"
describe("NFTAuctionFactory Contract", function () {
    let onePieceNFT, nftAuctionFactory
    let nftAddress, nftTokenId, factoryAddress ,auctionAdd
    let owner

    before(async function () {
        console.log("upgrades object:", upgrades);
        console.log("upgrades.deployProxy:", upgrades?.deployProxy);
        
        [owner] = await ethers.getSigners();
        const OnePieceNFT = await ethers.getContractFactory("OnePieceNFT");
        onePieceNFT = await OnePieceNFT.deploy();
        await onePieceNFT.waitForDeployment();

        const tx = await onePieceNFT.connect(owner).mintNFT(owner.address, ZORO_JSON_CID);
        nftAddress = await onePieceNFT.getAddress();
        nftTokenId = await onePieceNFT.nextTokenId();
        console.log("NFT Address:", nftAddress);
        console.log("NFT TokenId:", nftTokenId.toString());


       // Deploy NFTAuction implementation
       const NFTAuction = await ethers.getContractFactory("NFTAuction");
       nftAuctionImplementation = await NFTAuction.deploy();
       await nftAuctionImplementation.waitForDeployment();

       // Deploy NFTAuctionFactory with implementation address
       const NFTAuctionFactory = await ethers.getContractFactory("NFTAuctionFactory");
       nftAuctionFactory = await upgrades.deployProxy(NFTAuctionFactory, [
           await nftAuctionImplementation.getAddress()
       ], { initializer: 'initialize' });
       await nftAuctionFactory.waitForDeployment();

       factoryAddress = await nftAuctionFactory.getAddress();
       console.log("NFTAuctionFactory Address:", factoryAddress);
       console.log("NFTAuctionFactory deployed successfully");
    });

    it("create Aution", async function () {
        console.log("Creating auction for NFT:", nftAddress, "Token ID:", nftTokenId.toString());
        console.log("Owner Address:", owner.address);
        console.log("NFT factory address:", factoryAddress);
        await onePieceNFT.connect(owner).approve(factoryAddress, nftTokenId);
        console.log("NFT approved for auction factory");
        
        const tx =  await nftAuctionFactory.connect(owner).createAuction(
            nftAddress,
            nftTokenId,
            ethers.parseEther("1.0"), // reserve price
            5, // duration in seconds
            0, // PaymentCurrency.ETH
            ethers.ZeroAddress // ERC20 token address (not used for ETH)
        )
        const receipt = await tx.wait();
        console.log("Auction created successfully");
        auctionAdd = await nftAuctionFactory.getAuctionsByNFT(nftAddress, nftTokenId);
        console.log("Auction address:", auctionAdd);

        // Approve the NFT for the auction
        await onePieceNFT.connect(owner).approve(auctionAdd, nftTokenId);
    });

    it("bid on auction", async function () {
        const auctionAddress = await nftAuctionFactory.getAuctionsByNFT(nftAddress, nftTokenId);
        expect(auctionAddress).to.equals(auctionAdd, "Auction address should match");
        console.log("Auction address:", auctionAddress);
        
        const bidAmount = ethers.parseEther("1.0");
        // 获取合约对象
        const auction = await ethers.getContractAt("NFTAuction", auctionAddress, owner);
        const tx = await auction.placeBid(bidAmount, { value: bidAmount });
        const receipt = await tx.wait();
        console.log("Bid placed successfully");
    });


    it("clost an auction", async function () {
        const result = await new Promise(resolve => setTimeout(resolve, 6000));
        const auctionAddress = await nftAuctionFactory.getAuctionsByNFT(nftAddress, nftTokenId);
        expect(auctionAddress).to.not.equal(ethers.ZeroAddress, "Auction should exist");
        expect(auctionAddress).to.not.equal(null, "Auction address should not be null");
        expect(auctionAddress).to.equal(auctionAdd, "Auction address should match");
        console.log("Auction address:", auctionAddress);
        const tx = await nftAuctionFactory.connect(owner).closeAuction(nftAddress,nftTokenId);
        const receipt = await tx.wait();
        expect(receipt.status).to.equal(1, "Auction should be closed successfully");
        console.log("Auction closed successfully");
    });


    it("upgrade NFTAuctionFactory", async function () {
        // 获取V2工厂
        const NFTAuctionFactoryV2 = await ethers.getContractFactory("NFTAuctionFactoryV2");
        // 升级
        const upgraded = await upgrades.upgradeProxy(nftAuctionFactory, NFTAuctionFactoryV2);
        await upgraded.waitForDeployment();

        // 升级后地址不变
        expect(await upgraded.getAddress()).to.equal(await nftAuctionFactory.getAddress());

        // 新增功能可用
        expect(await upgraded.testUpgrade()).to.equal("success");
    });







});