// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract VoidVault is ReentrancyGuard {
    // State variables
    address private _owner;  // Current owner of the contract
    address private _initialOwner;  // Initial owner of the contract
    bool private _initialOwnershipTransferred;  // Flag to check if the initial owner has transferred ownership

    // Events for deposits and withdrawals
    event DepositETH(address indexed depositor, uint amount);
    event WithdrawETH(address indexed withdrawer, uint amount);
    event DepositERC20(address indexed depositor, address token, uint amount);
    event WithdrawERC20(address indexed withdrawer, address token, uint amount);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    // Constructor sets the deployer as the initial and current owner
    constructor() {
        _owner = msg.sender;
        _initialOwner = msg.sender;
        _initialOwnershipTransferred = false;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    // Modifier to restrict function access to the current owner
    modifier onlyOwner() {
        require(_owner == msg.sender, "Caller is not the owner");
        _;
    }

    // Modifier to restrict function access to the initial owner
    modifier onlyInitialOwner() {
        require(_initialOwner == msg.sender, "Caller is not the initial owner");
        _;
    }

    // Function to get the current owner
    function owner() public view returns (address) {
        return _owner;
    }

    // Function to get the initial owner
    function initialOwner() public view returns (address) {
        return _initialOwner;
    }

    // Function to transfer ownership, can be called by the current owner or initial owner
    function transferOwnership(address newOwner) public {
        require(
            msg.sender == _owner || (msg.sender == _initialOwner && !_initialOwnershipTransferred),
            "Caller cannot transfer ownership"
        );
        require(newOwner != address(0), "New owner cannot be the zero address");

        // Mark that the initial owner has transferred ownership
        if (msg.sender == _initialOwner) {
            _initialOwnershipTransferred = true;
        }

        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }

    // Deposit ETH into the vault
    function depositETH() public payable {}

    // Withdraw ETH from the vault
    function withdrawETH(uint amount) external onlyOwner nonReentrant {
        require(address(this).balance >= amount, "Insufficient ETH balance");
        payable(msg.sender).transfer(amount);
        emit WithdrawETH(msg.sender, amount);
    }

    // Deposit ERC20 tokens into the vault
    function depositERC20(address tokenAddress, uint amount) public nonReentrant {
        IERC20 token = IERC20(tokenAddress);
        // Transfer the tokens from the sender to this contract
        bool sent = token.transferFrom(msg.sender, address(this), amount);
        require(sent, "Token transfer failed");
        emit DepositERC20(msg.sender, tokenAddress, amount);
    }

    // Withdraw ERC20 tokens from the vault
    function withdrawERC20(address tokenAddress, uint amount) external onlyOwner nonReentrant {
        IERC20 token = IERC20(tokenAddress);
        require(token.balanceOf(address(this)) >= amount, "Insufficient token balance");
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

    // Fallback function to receive ETH deposits
    receive() external payable {
        emit DepositETH(msg.sender, msg.value);
    }
}
