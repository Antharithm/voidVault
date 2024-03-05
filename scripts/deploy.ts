import { ethers } from "hardhat";

async function main() {
  const voidVault = await ethers.deployContract("VoidVault");

  await voidVault.waitForDeployment();

  console.log(`VoidVault was deployed to: ${voidVault.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
