const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying CommunitySignalOracle to Sei...\n");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);
  
  // Check balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "SEI\n");

  if (balance < ethers.parseEther("0.01")) {
    console.warn("⚠️  Warning: Low balance. Make sure you have enough SEI for deployment.\n");
  }

  // Deploy the contract
  console.log("📄 Deploying CommunitySignalOracle contract...");
  const CommunitySignalOracle = await ethers.getContractFactory("CommunitySignalOracle");
  
  // Deploy with deployer as initial owner
  const oracle = await CommunitySignalOracle.deploy(deployer.address);
  
  console.log("⏳ Waiting for deployment transaction...");
  await oracle.waitForDeployment();
  
  const contractAddress = await oracle.getAddress();
  console.log("✅ CommunitySignalOracle deployed to:", contractAddress);
  
  // Get deployment transaction details
  const deployTx = oracle.deploymentTransaction();
  if (deployTx) {
    console.log("📊 Deployment tx hash:", deployTx.hash);
    console.log("⛽ Gas used:", deployTx.gasLimit?.toString() || "N/A");
  }

  console.log("\n🎯 Contract Details:");
  console.log("├── Address:", contractAddress);
  console.log("├── Owner:", deployer.address);
  console.log("├── Network: Sei Testnet");
  console.log("└── Chain ID: 1328");

  console.log("\n🔗 Useful Links:");
  console.log("├── Sei Explorer:", `https://seitrace.com/address/${contractAddress}`);
  console.log("└── Add to frontend:", contractAddress);

  console.log("\n📋 Next Steps:");
  console.log("1. Copy the contract address to your frontend");
  console.log("2. Update generateTop3SignalsAction with real contract integration");
  console.log("3. Authorize additional publishers if needed");
  console.log("4. Test with first signal batch");

  // Save deployment info
  const deploymentInfo = {
    network: "sei-testnet",
    chainId: 1328,
    contractAddress: contractAddress,
    deployerAddress: deployer.address,
    deploymentTime: new Date().toISOString(),
    txHash: deployTx?.hash || null
  };

  console.log("\n💾 Deployment Summary:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => {
    console.log("\n🎉 Deployment completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
