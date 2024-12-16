import { ethers } from "hardhat";

async function main() {
  console.log("Deploying contracts...");

  // Deploy ConsumableFactory first
  const ConsumableFactory = await ethers.getContractFactory("ConsumableFactory");
  const factory = await ConsumableFactory.deploy();
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  console.log("\nConsumableFactory deployed to:", factoryAddress);
  console.log("View on explorer:", `https://explorer-sepolia.shape.network/address/${factoryAddress}`);

  // Deploy TreasureChest
  const TreasureChest = await ethers.getContractFactory("TreasureChest");
  const chest = await TreasureChest.deploy(factoryAddress);
  await chest.waitForDeployment();
  const chestAddress = await chest.getAddress();
  console.log("\nTreasureChest deployed to:", chestAddress);
  console.log("View on explorer:", `https://explorer-sepolia.shape.network/address/${chestAddress}`);

  // Set TreasureChest address in factory
  await factory.setTreasureChestContract(chestAddress);
  console.log("\nTreasureChest address set in factory");

  // Create initial items
  console.log("\nCreating initial items...");
  await factory.createItem(1, "Common Bomb", 0, 0, 10);
  await factory.createItem(2, "Salmon Bowl", 0, 0, 15);
  await factory.createItem(3, "Ramen", 0, 0, 15);
  console.log("Initial items created");

  console.log("\nDeployment Summary:");
  console.log("-------------------");
  console.log("ConsumableFactory:", `https://explorer-sepolia.shape.network/address/${factoryAddress}`);
  console.log("TreasureChest:", `https://explorer-sepolia.shape.network/address/${chestAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 