const hre = require("hardhat");

async function main() {
  console.log("Deploying Seinsight AI contracts...");

  // Deploy AchievementNFT first
  const AchievementNFT = await hre.ethers.getContractFactory("AchievementNFT");
  const achievementNFT = await AchievementNFT.deploy();
  await achievementNFT.waitForDeployment();
  
  const achievementNFTAddress = await achievementNFT.getAddress();
  console.log("AchievementNFT deployed to:", achievementNFTAddress);

  // Deploy MilestoneRegistry with AchievementNFT address
  const MilestoneRegistry = await hre.ethers.getContractFactory("MilestoneRegistry");
  const milestoneRegistry = await MilestoneRegistry.deploy(achievementNFTAddress);
  await milestoneRegistry.waitForDeployment();
  
  const milestoneRegistryAddress = await milestoneRegistry.getAddress();
  console.log("MilestoneRegistry deployed to:", milestoneRegistryAddress);

  // Deploy InsightRegistry
  const InsightRegistry = await hre.ethers.getContractFactory("InsightRegistry");
  const insightRegistry = await InsightRegistry.deploy();
  await insightRegistry.waitForDeployment();
  
  const insightRegistryAddress = await insightRegistry.getAddress();
  console.log("InsightRegistry deployed to:", insightRegistryAddress);

  // Transfer ownership of AchievementNFT to MilestoneRegistry
  const transferOwnershipTx = await achievementNFT.transferOwnership(milestoneRegistryAddress);
  await transferOwnershipTx.wait();
  console.log("AchievementNFT ownership transferred to MilestoneRegistry");

  // Grant backend permission to publish insights
  const [deployer] = await hre.ethers.getSigners();
  const grantPublisherTx = await insightRegistry.grantPublisherRole(deployer.address);
  await grantPublisherTx.wait();
  console.log("Backend granted publisher role on InsightRegistry");

  console.log("Deployment completed successfully!");
  console.log("AchievementNFT:", achievementNFTAddress);
  console.log("MilestoneRegistry:", milestoneRegistryAddress);
  console.log("InsightRegistry:", insightRegistryAddress);
  
  // Save deployment addresses
  const deploymentInfo = {
    network: hre.network.name,
    contracts: {
      AchievementNFT: achievementNFTAddress,
      MilestoneRegistry: milestoneRegistryAddress,
      InsightRegistry: insightRegistryAddress
    },
    deployer: deployer.address,
    timestamp: new Date().toISOString()
  };
  
  console.log("\nDeployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
