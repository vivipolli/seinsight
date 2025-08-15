# 🚀 Deployment Information

## 📅 Deploy Date: 2025-08-15T14:34:35.843Z

## 🌐 Network: Hardhat (Local)

## 📋 Contract Addresses

### AchievementNFT
- **Address**: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- **Purpose**: ERC721 NFTs for milestone achievements
- **Owner**: MilestoneRegistry

### MilestoneRegistry
- **Address**: `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`
- **Purpose**: Register and manage project milestones
- **Features**: 
  - Register milestones
  - Mint achievement NFTs
  - List milestones by project

### InsightRegistry
- **Address**: `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0`
- **Purpose**: Store AI-generated insights
- **Features**:
  - Register insights
  - Approve insights
  - Query insights by project/type

## 👤 Deployer
- **Address**: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
- **Roles**: 
  - Owner of all contracts
  - Publisher role on InsightRegistry

## 🔧 Configuration Applied
- ✅ AchievementNFT ownership transferred to MilestoneRegistry
- ✅ Deployer granted publisher role on InsightRegistry
- ✅ All contracts properly linked

## 📝 Usage Examples

### Register a Milestone
```javascript
await milestoneRegistry.registerMilestonePublic(
  "project-123",
  "social_engagement",
  Math.floor(Date.now() / 1000),
  "0x1234567890abcdef..."
);
```

### Mint Achievement NFT
```javascript
await milestoneRegistry.registerMilestoneWithNFT(
  "project-123",
  "social_engagement",
  Math.floor(Date.now() / 1000),
  "0x1234567890abcdef...",
  "0xRecipientAddress",
  "ipfs://metadata.json"
);
```

### Register an Insight
```javascript
await insightRegistry.registerInsight(
  "project-123",
  "trend_analysis",
  "0xabcdef1234567890...",
  "ipfs://insight-data.json"
);
```

## 🚨 Important Notes
- These addresses are for local development only
- For production, deploy to Sei testnet/mainnet
- Update backend environment variables with these addresses
- Test all functionality before production deployment
