// SPDX-License-Identifier: MITa
pragma solidity ^0.8.13;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";




contract OnePieceNFT is ERC721URIStorage {
    uint256 public nextTokenId;
    address public admin;

    constructor() ERC721("OnePieceNFT", "OPNFT") {
        admin = msg.sender;
    }

    // function initialize() public initializer {
    //     __ERC721_init("OnePieceNFT", "OPNFT");
    //     admin = msg.sender;
    // }

    function mintNFT(
        address _recipient,
        string memory _tokenURI
    ) public returns (uint256) {
        nextTokenId++;
        _mint(_recipient, nextTokenId);
        _setTokenURI(nextTokenId, _tokenURI);
        return nextTokenId;
    }

}
