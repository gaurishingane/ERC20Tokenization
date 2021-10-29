// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CappuToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("Ganu Cappucino", "CAPPU") {
        _mint(msg.sender, initialSupply);
    }
}