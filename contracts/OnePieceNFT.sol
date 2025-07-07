// SPDX-License-Identifier: MITa
pragma solidity ^0.8.13;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";



contract OnePieceNFT is ERC721URIStorage {
    uint256 public nextTokenId;
    address public admin;

    constructor() ERC721("OnePieceNFT", "OPNFT") {
        admin = msg.sender;
    }

    function mintNFT(
        address _recipient,
        string memory _tokenURI
    ) public returns (uint256) {
        uint newItemId = nextTokenId;
        _mint(_recipient, nextTokenId);
        nextTokenId++;
        _setTokenURI(nextTokenId, _tokenURI);
        return newItemId;
    }

}
