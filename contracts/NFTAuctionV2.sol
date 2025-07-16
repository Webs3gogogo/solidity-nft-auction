// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
// 支持合约升级
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./PriceConverter.sol";

contract NFTAuctionV2 is Initializable, ReentrancyGuardUpgradeable {
    enum AuctionStatus {
        OPEN,
        CLOSE,
        CANCELLED
    }
    enum PaymentCurrency {
        ETH,
        ERC20
    }

    struct Bid {
        address bidder;
        uint256 amount;
        uint256 timestamp;
    }

    uint256 public nftTokenId;
    address public nftAddress;
    uint256 public reservePrice;
    address public seller;
    uint256 public startTime;
    uint256 public endTime;
    address public factoryAddress;

    //inner variable
    Bid public highestBid;
    Bid public allBids;

    AuctionStatus public auctionStatus;
    PaymentCurrency paymentCurrency;
    address erc20Token;

    function initialize() public initializer {
        //OpenZeppelin 的 ReentrancyGuardUpgradeable（和其它 Upgradeable 合约）把原来构造函数里的初始化逻辑，全部迁移到了 __ReentrancyGuard_init() 这样的初始化函数里
        __ReentrancyGuard_init();
    }

    function setData(
        uint256 _nftTokenId,
        address _nftAddress,
        address _seller,
        uint256 _duration,
        uint256 _reservePrice,
        PaymentCurrency _paymentCurrency,
        address _erc20Token,
        address _factoryAddress
    ) public {
        nftTokenId = _nftTokenId;
        nftAddress = _nftAddress;
        seller = _seller;
        startTime = block.timestamp;
        endTime = block.timestamp + _duration;
        reservePrice = _reservePrice;
        auctionStatus = AuctionStatus.OPEN;
        paymentCurrency = _paymentCurrency;
        erc20Token = _erc20Token;
        factoryAddress = _factoryAddress;
    }

    function placeBid(uint256 _amount) external payable nonReentrant {
        require(auctionStatus == AuctionStatus.OPEN, "Auction is not open");
        require(block.timestamp < endTime, "Auction has ended");
        require(
            _amount > highestBid.amount && _amount >= reservePrice,
            "Bid amount must be higher than current highest bid and reserve price"
        );
        uint unifyStandardAmount;
        // if (paymentCurrency == PaymentCurrency.ETH) {
        //     require(msg.value == _amount, "ETH amount mismatch");
        //     unifyStandardAmount = msg.value * PriceConverter.getEthPrice() / 1e18; // Convert to 18 decimals
        // } else {
        //     IERC20 token = IERC20(erc20Token);
        //     require(token.transferFrom(msg.sender, address(this), _amount), "ERC20 transfer failed");
        //     unifyStandardAmount = _amount * PriceConverter.getUSDCPrice() / 1e18; // Convert to 18 decimals
        // }

        unifyStandardAmount = msg.value;

        require(
            unifyStandardAmount > highestBid.amount,
            "Bid must be higher than current highest"
        );

        // Refund the previous highest bidder
        if (highestBid.bidder != address(0)) {
            if (paymentCurrency == PaymentCurrency.ETH) {
                payable(highestBid.bidder).transfer(highestBid.amount);
            } else {
                IERC20 token = IERC20(erc20Token);
                require(
                    token.transfer(highestBid.bidder, highestBid.amount),
                    "Refund failed"
                );
            }
        }
        highestBid = Bid(msg.sender, unifyStandardAmount, block.timestamp);
    }

    function closeAuction() public {
        require(auctionStatus == AuctionStatus.OPEN, "Auction is not open");
        require(
            block.timestamp >= endTime || msg.sender == seller,
            "Auction not ended or not seller"
        );

        auctionStatus = AuctionStatus.CLOSE;

        if (highestBid.bidder != address(0) && highestBid.amount != 0) {
            // Transfer NFT to the highest bidder
            IERC721(nftAddress).transferFrom(
                seller,
                highestBid.bidder,
                nftTokenId
            );
            if (PaymentCurrency.ETH == paymentCurrency) {
                // Transfer ETH to the seller
                payable(seller).transfer(highestBid.amount);
            } else {
                // Transfer ERC20 tokens to the seller
                IERC20 token = IERC20(erc20Token);
                require(
                    token.transfer(seller, highestBid.amount),
                    "ERC20 transfer to seller failed"
                );
            }
        } else {
            // If no bids were placed, the NFT remains with the seller
            auctionStatus = AuctionStatus.CANCELLED;
        }
    }

    function testUpgrade() public pure returns (string memory) {
        return "testAuctionUpgrade";
    }
}
