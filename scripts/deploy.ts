import { ethers } from "hardhat";

async function main() {
  const [initialOwner] = await ethers.getSigners();

  console.log("Deploying and initialize Vault owner:", initialOwner.address);
  // console.log("Account balance:", (await deployer.getBalance()).toString());

  const VoidVault = await ethers.getContractFactory("VoidVault");
  const voidVault = await VoidVault.deploy(initialOwner.address);

  // await voidVault.deployed();

  console.log("VoidVault deployed to:", voidVault.target);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
