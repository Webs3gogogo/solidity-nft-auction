const { expect } = require("chai");
const { ethers } = require("hardhat");
const ZORO_JSON_CID = "bafkreic65r34quampjfso5txnch4rezmpznhefuor3va773iftgt3sdeqa"
describe("NFTAuctionFactory Contract", function () {
    let nftAuctionFactory
    before(async function(){
        [owner] = await ethers.getSigners();
        OnePieceNFT = await ethers.getContractFactory("OnePieceNFT");
        onePieceNFT = await OnePieceNFT.deploy();
        await onePieceNFT.waitForDeployment();
        const tx = await onePieceNFT.mintNFT(owner.address, tokenURI);
        await tx.wait();
        console.log("NFT Address:", onePieceNFT.getAddress());
        console.log("NFT TokenId:", (await onePieceNFT.nextTokenId()).toString());
        const NFTAuctionFactory = await ethers.getContractFactory("NFTAuctionFactory");
        nftAuctionFactory = await NFTAuctionFactory.deploy();
        await nftAuctionFactory.waitForDeployment();


    })

    it("create Aution", async function () {
        // await nftAuctionFactory.createAuction(
        //     address _nftAddress,
        //     uint256 _nftTokenId,
        //     uint256 _reservePrice,
        //     NFTAuction.PaymentCurrency _paymentCurrency,
        //     address _erc20Token
        // )

    });









});