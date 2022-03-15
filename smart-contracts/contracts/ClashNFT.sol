// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ClashOfCards is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    IERC20 public clashToken;

    constructor(address _clashTokenAddress) ERC721("ClashOfCards", "CLASH") {
        clashToken = IERC20(_clashTokenAddress);
    }

    mapping(string => uint8) public existingURIs;
    mapping(address => string[]) public userCollection;

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://";
    }

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        userCollection[to].push(uri);
    }

    function payToMint(
        address recipient,
        string memory pinataURI,
        uint256 amount
    ) public payable returns (uint256) {
        require(existingURIs[pinataURI] != 1, "NFT already minted!");
        require(
            clashToken.transferFrom(msg.sender, address(this), amount),
            "Pay Up"
        );

        uint256 newItemId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        existingURIs[pinataURI] = 1;

        _mint(recipient, newItemId);
        _setTokenURI(newItemId, pinataURI);
        userCollection[recipient].push(pinataURI);
        return newItemId;
    }

    function isContentOwned(string memory uri) public view returns (bool) {
        return existingURIs[uri] == 1;
    }

    function getAllNFTs(address user) public view returns (string[] memory) {
        return userCollection[user];
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}
