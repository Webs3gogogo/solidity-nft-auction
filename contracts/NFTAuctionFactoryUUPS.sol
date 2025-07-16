// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
// 支持UUPS
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "./NFTAuction.sol";
import "./OnePieceNFT.sol";

contract NFTAuctionFactoryUUPS is
    Initializable,
    UUPSUpgradeable,
    OwnableUpgradeable
{
    address[] public auctions;
    mapping(address => mapping(uint256 => NFTAuction)) public tokenIdToAddress;

    uint256 public nextAuctionId;
  

    function initialize() public initializer {
        __Ownable_init(msg.sender);
    }

    function createAuction(
        address _nftAddress,
        uint256 _nftTokenId,
        uint256 _reservePrice,
        uint256 _duration,
        NFTAuction.PaymentCurrency _paymentCurrency,
        address _erc20Token,
        address _nftAuctionBeaconProxyAddress
    ) public returns (address) {
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

        // Check if auction already exists for this NFT
        NFTAuction existingAuction = tokenIdToAddress[_nftAddress][_nftTokenId];
        require(
            address(existingAuction) == address(0) ||
                existingAuction.auctionStatus() !=
                NFTAuction.AuctionStatus.OPEN,
            "Auction for this NFT already exists"
        );

        // 初始化代理合约
        NFTAuction(_nftAuctionBeaconProxyAddress).setData(
            _nftTokenId,
            _nftAddress,
            msg.sender,
            _duration,
            _reservePrice,
            _paymentCurrency,
            _erc20Token,
            address(this)
        );

        auctions.push(_nftAuctionBeaconProxyAddress);
        tokenIdToAddress[_nftAddress][_nftTokenId] = NFTAuction(_nftAuctionBeaconProxyAddress);

        return _nftAuctionBeaconProxyAddress;
    }

    function closeAuction(address _nftAddress, uint256 _nftTokenId) public {
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

    function getAuctionsByNFT(
        address _nftAddress,
        uint256 _nftTokenId
    ) external view returns (address) {
        return address(tokenIdToAddress[_nftAddress][_nftTokenId]);
    }

    function getAuctionsCount() external view returns (uint256) {
        return auctions.length;
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}
}
