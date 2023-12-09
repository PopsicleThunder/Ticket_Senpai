// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";

contract MyERC721 is ERC721, ERC721Burnable{
    constructor()
        ERC721("MyToken", "MTK")
    {}

    function mintUniqueTicket(address to, uint256 tokenId) external {
        _safeMint(to, tokenId);
    }

     function burnUniqueTicket(uint256 tokenId) external {
        _burn(tokenId);
    }
}