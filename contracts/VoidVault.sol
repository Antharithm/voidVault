// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "hardhat/console.sol";

contract VoidVault {
    address payable public owner;

    constructor() {
        owner = payable(msg.sender);
    }

    receive() external payable {}

    function withdraw(uint amount) external {
        require(msg.sender == owner, "You are not the owner of the wallet.");
        payable(msg.sender).transfer(amount);
    }

    function getBalance() external view returns (uint) {
        return address(this).balance;
    }
}
