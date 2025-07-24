// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract UniGeCoin is ERC20, Ownable {
    constructor(uint256 initialSupply) ERC20("UniGeCoin", "UGC") Ownable(msg.sender) {
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }

    function reward(address to, uint256 amount) external onlyOwner {
        _mint(to, amount * 10 ** decimals());
    }

    function burn(address from, uint256 amount) external onlyOwner {
        _burn(from, amount * 10 ** decimals());
    }
}