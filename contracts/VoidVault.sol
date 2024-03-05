// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "hardhat/console.sol";

contract VoidVault {
    address payable public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner of this wallet.");
        _;
    }
    // Deposit event
    event DepositMade(address indexed depositor, uint amount);
    event WithdrawalMade(address indexed withdrawler, uint amount);

    constructor() {
        owner = payable(msg.sender);
    }

    // Accept deposits
    function deposit() public payable {
        emit DepositMade(msg.sender, msg.value);
    }

    // Receive external deposits
    receive() external payable {
        emit DepositMade(msg.sender, msg.value);
    }

    function withdraw(uint amount) external onlyOwner {
        require(
            address(this).balance >= amount,
            "Insufficient funds in the vault."
        );
        payable(msg.sender).transfer(amount);
        emit WithdrawalMade(msg.sender, amount);
    }

    function getBalance() external view returns (uint) {
        return address(this).balance;
    }
}
