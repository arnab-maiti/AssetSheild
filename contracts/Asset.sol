// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.6.0
pragma solidity ^0.8.27;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Asset is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    mapping (address => bool) public authorizedMinters;
   event AssetMinted(uint256 tokenId, address to, string uri);
   event MinterAdded(address minter);
event MinterRemoved(address minter);
    modifier onlyAuthorized() {
        require(authorizedMinters[msg.sender],"Not Authorized");
        _;
    }
    constructor(address initialOwner)
        ERC721("Asset", "AST")
        Ownable(initialOwner)
    {}

    function safeMint(address to, string memory uri)
        external
        onlyAuthorized
        returns (uint256)
    {
        require(to != address(0), "Invalid address");
        require(bytes(uri).length > 0, "URI required");
        uint256 tokenId = ++_nextTokenId;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        emit AssetMinted(tokenId,to,uri);
        return tokenId;
    }
    function addMinter(address _minter) external onlyOwner {
    require(_minter != address(0), "Invalid address");
    require(!authorizedMinters[_minter], "Already a minter");

    authorizedMinters[_minter] = true;

    emit MinterAdded(_minter);
}
    function removeMinter(address _minter) external onlyOwner {
        require(authorizedMinters[_minter], "Not a minter");
        authorizedMinters[_minter]=false;
        emit MinterRemoved(_minter);
    }
    // The following functions are overrides required by Solidity.

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

     function _update(address to, uint256 tokenId, address auth)
    internal
    override
    returns (address)
{
    address from = _ownerOf(tokenId);

    if (from != address(0) && to != address(0)) {
        revert("Soulbound: Transfers not allowed");
    }

    return super._update(to, tokenId, auth);
}

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}