// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VoidVault is ReentrancyGuard, Ownable {
    // Emit events for deposits and withdrawals
    event DepositETH(address indexed depositor, uint amount);
    event WithdrawETH(address indexed withdrawer, uint amount);
    event DepositERC20(address indexed depositor, address token, uint amount);
    event WithdrawERC20(address indexed withdrawer, address token, uint amount);

    constructor(address initialOwner) Ownable(initialOwner) {}

    // Function to receive ETH deposits
    receive() external payable {
        emit DepositETH(msg.sender, msg.value);
    }

    // Withdraw ETH from the vault
    function withdrawETH(uint amount) external onlyOwner nonReentrant {
        require(address(this).balance >= amount, "Insufficient ETH balance");
        payable(msg.sender).transfer(amount);
        emit WithdrawETH(msg.sender, amount);
    }

    // Deposit ERC20 tokens into the vault
    function depositERC20(
        address tokenAddress,
        uint amount
    ) public nonReentrant {
        IERC20 token = IERC20(tokenAddress);
        // Transfer the tokens from the sender to this contract
        bool sent = token.transferFrom(msg.sender, address(this), amount);
        require(sent, "Token transfer failed");
        emit DepositERC20(msg.sender, tokenAddress, amount);
    }

    // Withdraw ERC20 tokens from the vault
    function withdrawERC20(
        address tokenAddress,
        uint amount
    ) external onlyOwner nonReentrant {
        IERC20 token = IERC20(tokenAddress);
        require(
            token.balanceOf(address(this)) >= amount,
            "Insufficient token balance"
        );
        // Transfer the tokens from this contract to the owner
        bool sent = token.transfer(msg.sender, amount);
        require(sent, "Token transfer failed");
        emit WithdrawERC20(msg.sender, tokenAddress, amount);
    }

    // Get the ETH balance of the vault
    function getETHBalance() public view returns (uint) {
        return address(this).balance;
    }

    // Get the ERC20 token balance of the vault
    function getERC20Balance(address tokenAddress) public view returns (uint) {
        IERC20 token = IERC20(tokenAddress);
        return token.balanceOf(address(this));
    }
}
