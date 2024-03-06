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

  before(async function () {
    const VoidVault = await ethers.getContractFactory("VoidVault");
    voidVault = await VoidVault.deploy();
    console.log(`VoidVault was deployed to: ${voidVault.address}`);

    [owner, depositor1, depositor2] = await ethers.getSigners();
    console.log("Owner Address: ", owner.address);
    console.log("addr1 Address: ", depositor1.address);
    console.log("addr2 Address: ", depositor2.address);
  });

  describe("Deposits", function () {
    it("Should let any address deposit ETH into the Vault", async function () {
      const depositAmount = ethers.parseEther("1");
      console.log("Deposit Amount: ", ethers.formatEther(depositAmount));

      await voidVault.connect(depositor1).deposit({ value: depositAmount });

      const balance = await ethers.provider.getBalance(voidVault.target);
      expect(balance).to.eq(depositAmount);
    });
  });
});
