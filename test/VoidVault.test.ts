import { expect } from "chai";
import { ethers } from "hardhat";

describe("VoidVault", function () {
  const ONE_ETH = ethers.parseEther("1");
  const TWO_ETH = ethers.parseEther("2");
  const TEN_ETH = ethers.parseEther("10");

  // Contracts
  let voidVault: any;

  // Addresses
  let owner: any;
  let depositor1: any;
  let depositor2: any;

  beforeEach(async function () {
    const VoidVault = await ethers.getContractFactory("VoidVault");
    voidVault = await VoidVault.deploy();
    console.log(`VoidVault was deployed to: ${voidVault.target}`);

    [owner, depositor1, depositor2] = await ethers.getSigners();
    console.log("Owner Address: ", owner.address);
    console.log("Depositor1 Address: ", depositor1.address);
    console.log("Depositor2 Address: ", depositor2.address);
  });

  describe("Vault Deposits:", function () {
    it("Should let any address deposit 1 ETH into the Vault", async function () {
      console.log("Deposit Amount: ", ethers.formatEther(ONE_ETH));

      await voidVault.connect(depositor1).deposit({ value: ONE_ETH });

      const balance = await ethers.provider.getBalance(voidVault.target);
      expect(balance).to.equal(ONE_ETH);
      console.log("Vault Balance: ", ethers.formatEther(balance));
    });
  });

  describe("Vault Withdraws", function () {
    it("Should only allow the owner to withdraw from the Vault", async function () {
      console.log("Deposit Amount: ", ethers.formatEther(ONE_ETH));

      await voidVault.connect(depositor1).deposit({ value: ONE_ETH });

      const balance = await ethers.provider.getBalance(voidVault.target);
      expect(balance).to.equal(ONE_ETH);
      console.log("Vault Balance: ", ethers.formatEther(balance));

      const withdrawAmount = ethers.parseEther("0.5");
      await expect(voidVault.connect(owner).withdraw(withdrawAmount))
        .to.emit(voidVault, "WithdrawalMade")
        .withArgs(owner.address, withdrawAmount)
        .then(() =>
          console.log(
            "Owner = Withdrawal successful: WithdrawalMade event emitted."
          )
        );

      await expect(voidVault.connect(depositor1).withdraw(withdrawAmount))
        .to.be.revertedWith("You are not the owner of this wallet.")
        .then(() =>
          console.log(
            "Non Owner = Withdrawal failed: You are not the owner of the Vault."
          )
        );

      console.log("Vault Balance: ", ethers.formatEther(balance));
    });
  });
});
