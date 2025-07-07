// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./NFTAuction.sol";
import "./OnePieceNFT.sol";

contract NFTAuctionFactory {
    address[] public auctions;
    mapping(address => mapping(uint256 => NFTAuction)) public tokenIdToAddress;

    uint256 public nextAuctionId;

    constructor() {}

    function createAuction(
        address _nftAddress,
        uint256 _nftTokenId,
        uint256 _reservePrice,
        NFTAuction.PaymentCurrency _paymentCurrency,
        address _erc20Token
    ) public {
        require(_reservePrice > 0, "Reserve price must be greater than zero");
        require(
            _nftAddress != address(0),
            "NFT address cannot be zero address"
        );

        // Ensure the NFT owner is msg sender
        require(
            IERC721(_nftAddress).ownerOf(_nftTokenId) == msg.sender,
            "You are not the owner of this NFT"
        );

        require(
            tokenIdToAddress[_nftAddress][_nftTokenId].auctionStatus() !=
                NFTAuction.AuctionStatus.OPEN,
            "Auction for this NFT already exists"
        );

        NFTAuction auction = new NFTAuction(
            _nftTokenId,
            _nftAddress,
            msg.sender,
            24 * 60 * 60, // 24 hours
            _reservePrice,
            _paymentCurrency,
            _erc20Token,
            address(this)
        );
        auctions.push(address(auction));
        tokenIdToAddress[_nftAddress][_nftTokenId] = auction;
    }

    function closeAuction(
        address _nftAddress,
        uint256 _nftTokenId
    ) public {
        NFTAuction auction = tokenIdToAddress[_nftAddress][_nftTokenId];
        require(
            auction.auctionStatus() == NFTAuction.AuctionStatus.OPEN,
            "Auction is not open"
        );
        require(
            msg.sender == auction.seller(),
            "Only the seller can end the auction"
        );
        auction.closeAuction();
    }

    function getAuctions() external view returns (address[] memory) {
        return auctions;
    }

    function getAuctionsCount() external view returns (uint256) {
        return auctions.length;
    }
}
