const { starknet } = require("hardhat");

async function main() {
  // compile the contract and deploy
  const usdcLockContractFactory = await starknet.getContractFactory("contracts/USDC_Lock.cairo");
  const usdcLockContract = await usdcLockContractFactory.deploy();

  console.log("USDC Lock Contract deployed at:", usdcLockContract.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
