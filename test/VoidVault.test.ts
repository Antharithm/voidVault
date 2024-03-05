import { expect } from "chai";
import { ethers } from "hardhat";

describe("VoidVault", function () {
  const ONE_ETH = ethers.utils.parseEther("1");
  const TWO_ETH = ethers.utils.parseEther("2");
  const TEN_ETH = ethers.utils.parseEther("10");

  // Contracts
  let voidVault: any;

  // Addresses
  let owner: any;
  let addr1: any;
  let addr2: any;

  describe("VoidVault", function () {
    beforeEach(async function () {
      const VoidVault = await ethers.getContractFactory("VoidVault");
      voidVault = await VoidVault.deploy();
      await voidVault.deployed();
      console.log(`VoidVault was deployed to: ${voidVault.address}`);

      [owner, addr1, addr2] = await ethers.getSigners();
      console.log("Owner Address: ", owner.address);
      console.log("addr1 Address: ", addr1.address);
      console.log("addr2 Address: ", addr2.address);
    });
  });
  // describe("Deposits", function () {
  //   it("Should let any address deposit ETH into the Vault", async function () {
  //     const depositAmount = ethers.utils.parseEther("1.0");
  //     await voidVault.connect(addr1).deposit({ value: depositAmount });

  //     const balance = await ethers.provider.getBalance(voidVault.address);
  //     expect(balance).to.equal(depositAmount);
  //   });
  // });
});
