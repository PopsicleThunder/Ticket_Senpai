// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";

contract MyERC1155 is ERC1155, ERC1155Burnable {
    constructor() ERC1155("") {}

    function mintNonUniqueTicket(address account, uint256 id, uint256 amount, bytes memory data)
        public
    {
        _mint(account, id, amount, data);
    }

    function burnNonUniqueTicket(address account, uint256 id, uint256 amount) external {
        _burn(account, id, amount);
    }
    
}   