const { expect } = require("chai");
const { ethers } = require("hardhat");
require('@openzeppelin/hardhat-upgrades');
describe("NFTAuction Contract", function () {
    let NFTAuction;
    let nftAuction;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        NFTAuction = await ethers.getContractFactory("NFTAuction");
        [owner, addr1, addr2] = await ethers.getSigners();
        nftAuction = await upgrades.deployProxy(NFTAuction, [], { initializer: 'initialize' });
        await nftAuction.waitForDeployment();
    });

    it("should create an auction", async function () {
        await nftAuction.createAuction("tokenURI", ethers.utils.parseEther("1"), 3600);
        const auction = await nftAuction.auctions(0);
        expect(auction.tokenURI).to.equal("tokenURI");
        expect(auction.startingBid).to.equal(ethers.utils.parseEther("1"));
    });

    it("should place a bid", async function () {
        await nftAuction.createAuction("tokenURI", ethers.utils.parseEther("1"), 3600);
        await nftAuction.connect(addr1).placeBid(0, { value: ethers.utils.parseEther("2") });
        const auction = await nftAuction.auctions(0);
        expect(auction.highestBid).to.equal(ethers.utils.parseEther("2"));
        expect(auction.highestBidder).to.equal(addr1.address);
    });

    it("should end an auction", async function () {
        await nftAuction.createAuction("tokenURI", ethers.utils.parseEther("1"), 3600);
        await nftAuction.connect(addr1).placeBid(0, { value: ethers.utils.parseEther("2") });
        await nftAuction.endAuction(0);
        const auction = await nftAuction.auctions(0);
        expect(auction.ended).to.equal(true);
    });
});