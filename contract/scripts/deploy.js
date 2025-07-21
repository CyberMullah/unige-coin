const hre = require("hardhat");

async function main() {
  const UniGeCoin = await hre.ethers.getContractFactory("UniGeCoin");
  const token = await UniGeCoin.deploy(2000); // 2000 UGC
  await token.waitForDeployment();

  console.log(`✅ UniGeCoin deployed at: ${await token.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});