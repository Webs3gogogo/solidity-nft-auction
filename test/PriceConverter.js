const { expect } = require("chai");
const { ethers, network } = require("hardhat");

describe("PriceConverter", function () { 
    let testPriceConverter, mockAggregator;

    before(async function () {
        // 部署 mock aggregator
        const MockAggregator = await ethers.getContractFactory("MockV3Aggregator");
        // 8位小数，2000美元
        mockAggregator = await MockAggregator.deploy(8, "200000000000");
        await mockAggregator.waitForDeployment();

        const TestPriceConverter = await ethers.getContractFactory("TestPriceConverter");
        testPriceConverter = await TestPriceConverter.deploy();
        await testPriceConverter.waitForDeployment();
    });

    it("should convert ETH to USD", async function () {
        const ethAmount = ethers.parseEther("1.0");
        const usdPrice = await testPriceConverter.testGetConversionRate(ethAmount, mockAggregator.target);
        expect(usdPrice).to.be.gt(0);
    });

    it("should handle zero ETH conversion", async function () {
        const ethAmount = ethers.parseEther("0.0");
        const usdPrice = await testPriceConverter.testGetConversionRate(ethAmount, mockAggregator.target);
        expect(usdPrice).to.equal(0);
    });

});