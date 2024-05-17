const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
import { expect } from "chai";
import { ethers } from "hardhat";

describe("VoidVault", function () {
  async function deployVaultFixture() {
    const [owner, depositor1] = await ethers.getSigners();

    // Deploy VoidVault
    const VoidVault = await ethers.getContractFactory("VoidVault");
    const voidVault = await VoidVault.deploy();

    // Deploy MockERC20 token
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    const mockERC20 = await MockERC20.deploy("MockToken", "MTK");

    // Mint some tokens to depositor1 for testing
    const mintAmount = ethers.parseEther("1000"); // 1000 MockToken
    await mockERC20.mint(depositor1.address, mintAmount);

    return { voidVault, mockERC20, owner, depositor1 };
  }

  describe("ETH deposits", function () {
    // Existing test case for depositing ETH
  });

  // Additional test cases for ERC20 deposits and withdrawals
  describe("ERC20 deposits", function () {
    it("should allow depositing ERC20 tokens into the vault", async function () {
      const { voidVault, mockERC20, depositor1 } = await loadFixture(
        deployVaultFixture
      );
      const depositAmount = ethers.parseEther("50"); // 50 MockToken

      // Approve the vault to spend depositor's tokens
      await mockERC20
        .connect(depositor1)
        .approve(voidVault.address, depositAmount);

      // Depositor deposits ERC20 tokens into the vault
      await expect(
        voidVault
          .connect(depositor1)
          .depositERC20(mockERC20.address, depositAmount)
      )
        .to.emit(voidVault, "DepositERC20")
        .withArgs(depositor1.address, mockERC20.address, depositAmount);

      // Validate the token balance of the vault
      const vaultTokenBalance = await mockERC20.balanceOf(voidVault.address);
      expect(vaultTokenBalance).to.equal(depositAmount);
    });
  });

  describe("Ownership", function () {
    it("should allow the initial owner to transfer ownership", async function () {
      const { voidVault, owner, depositor1 } = await loadFixture(
        deployVaultFixture
      );

      // Transfer ownership to depositor1
      await expect(
        voidVault.connect(owner).transferOwnership(depositor1.address)
      )
        .to.emit(voidVault, "OwnershipTransferred")
        .withArgs(owner.address, depositor1.address);

      // Validate the new owner
      expect(await voidVault.owner()).to.equal(depositor1.address);
    });

    it("should not allow the initial owner to transfer ownership again after the first transfer", async function () {
      const { voidVault, owner, depositor1 } = await loadFixture(
        deployVaultFixture
      );

      // Transfer ownership to depositor1
      await voidVault.connect(owner).transferOwnership(depositor1.address);

      // Try to transfer ownership again as the initial owner
      await expect(
        voidVault.connect(owner).transferOwnership(owner.address)
      ).to.be.revertedWith("Caller cannot transfer ownership");
    });

    it("should allow the new owner to transfer ownership", async function () {
      const { voidVault, owner, depositor1 } = await loadFixture(
        deployVaultFixture
      );

      // Transfer ownership to depositor1
      await voidVault.connect(owner).transferOwnership(depositor1.address);

      // Transfer ownership back to owner
      await expect(
        voidVault.connect(depositor1).transferOwnership(owner.address)
      )
        .to.emit(voidVault, "OwnershipTransferred")
        .withArgs(depositor1.address, owner.address);

      // Validate the new owner
      expect(await voidVault.owner()).to.equal(owner.address);
    });
  });
});
