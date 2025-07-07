const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTAuctionFactory Contract", function () {
    let nftAuctionFactory
    before(async function(){
        const NFTAuctionFactory = await ethers.getContractFactory("NFTAuctionFactory");
        nftAuctionFactory = await NFTAuctionFactory.deploy();
        await nftAuctionFactory.waitForDeployment();
    })

    







});