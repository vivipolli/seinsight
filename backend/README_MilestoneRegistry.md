# MilestoneRegistry Smart Contracts

A comprehensive Solidity smart contract system for registering project milestones with optional NFT rewards on EVM-compatible blockchains.

## Overview

The system consists of two main contracts:

1. **MilestoneRegistry**: Main contract for registering and managing project milestones
2. **AchievementNFT**: ERC721 contract for minting achievement NFTs as milestone rewards

## Features

### MilestoneRegistry
- ✅ Register milestones with project ID, type, timestamp, and payload hash
- ✅ Role-based access control for milestone registration
- ✅ Efficient storage and retrieval of milestones by project
- ✅ Duplicate prevention with hash-based verification
- ✅ Event emission for off-chain tracking
- ✅ Optional NFT minting during milestone registration

### AchievementNFT
- ✅ ERC721 standard compliance
- ✅ Metadata storage for project ID, milestone type, and timestamp
- ✅ Project-based achievement tracking
- ✅ Custom token URIs for external artwork
- ✅ Owner-only minting with role delegation

## Contract Architecture

```
MilestoneRegistry (Ownable + AccessControl)
├── registerMilestone() - Basic milestone registration
├── registerMilestoneWithNFT() - Registration with NFT minting
├── getMilestonesByProject() - Retrieve project milestones
├── grantRegistrarRole() - Role management
└── Events for off-chain tracking

AchievementNFT (ERC721 + Ownable)
├── mintNFT() - Mint achievement NFTs
├── getAchievementMetadata() - Retrieve NFT metadata
├── getProjectAchievements() - Get project achievement list
└── Standard ERC721 functions
```

## Deployment

### Prerequisites
- Node.js and npm/yarn
- Hardhat development environment
- OpenZeppelin contracts (already included)

### Deploy Commands

```bash
# Install dependencies
npm install

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to local network
npx hardhat run scripts/deploy.js --network hardhat

# Deploy to Sei testnet
npx hardhat run scripts/deploy.js --network seitestnet

# Deploy to Sei mainnet
npx hardhat run scripts/deploy.js --network seimainnet
```

## Usage Examples

### 1. Register a Basic Milestone

```javascript
const projectId = "project-123";
const milestoneType = "development";
const timestamp = Math.floor(Date.now() / 1000);
const payloadHash = ethers.keccak256(ethers.toUtf8Bytes("milestone data"));

await milestoneRegistry.registerMilestone(
    projectId,
    milestoneType,
    timestamp,
    payloadHash
);
```

### 2. Register Milestone with NFT Reward

```javascript
const projectId = "project-123";
const milestoneType = "milestone";
const timestamp = Math.floor(Date.now() / 1000);
const payloadHash = ethers.keccak256(ethers.toUtf8Bytes("milestone data"));
const recipient = "0x..."; // NFT recipient address
const tokenURI = "ipfs://QmYourArtworkHash";

await milestoneRegistry.registerMilestoneWithNFT(
    projectId,
    milestoneType,
    timestamp,
    payloadHash,
    recipient,
    tokenURI
);
```

### 3. Retrieve Project Milestones

```javascript
const milestones = await milestoneRegistry.getMilestonesByProject("project-123");
console.log(`Project has ${milestones.length} milestones`);

milestones.forEach((milestone, index) => {
    console.log(`Milestone ${index + 1}:`, {
        projectId: milestone.projectId,
        type: milestone.milestoneType,
        timestamp: milestone.timestamp,
        payloadHash: milestone.payloadHash
    });
});
```

### 4. Get Achievement NFTs

```javascript
const achievements = await achievementNFT.getProjectAchievements("project-123");
console.log(`Project has ${achievements.length} achievement NFTs`);

for (const tokenId of achievements) {
    const metadata = await achievementNFT.getAchievementMetadata(tokenId);
    const owner = await achievementNFT.ownerOf(tokenId);
    console.log(`Token ${tokenId}:`, {
        projectId: metadata.projectId,
        type: metadata.milestoneType,
        timestamp: metadata.timestamp,
        owner: owner
    });
}
```

### 5. Role Management

```javascript
// Grant milestone registration role
await milestoneRegistry.grantRegistrarRole("0xRegistrarAddress");

// Revoke milestone registration role
await milestoneRegistry.revokeRegistrarRole("0xRegistrarAddress");
```

## Security Features

- **Access Control**: Only authorized addresses can register milestones
- **Duplicate Prevention**: Hash-based verification prevents duplicate registrations
- **Input Validation**: Comprehensive parameter validation
- **Role Management**: Flexible role-based permissions
- **Event Logging**: Complete audit trail for off-chain tracking

## Gas Optimization

- Efficient storage mappings for quick lookups
- Minimal storage operations
- Optimized data structures
- No unnecessary loops in critical functions

## Events

### MilestoneRegistry Events
- `MilestoneRegistered(projectId, milestoneType, timestamp, payloadHash, registrant)`
- `NFTMinted(projectId, milestoneType, timestamp, recipient, tokenId)`

### AchievementNFT Events
- `AchievementMinted(tokenId, projectId, milestoneType, timestamp, recipient)`
- Standard ERC721 events (Transfer, etc.)

## Testing

Run the comprehensive test suite:

```bash
npx hardhat test
```

Tests cover:
- ✅ Basic milestone registration
- ✅ NFT minting functionality
- ✅ Access control and permissions
- ✅ Data retrieval and validation
- ✅ Integration between contracts
- ✅ Error handling and edge cases

## Network Configuration

The contracts are configured for:
- **Local Development**: Hardhat Network (chainId: 31337)
- **Sei Testnet**: EVM testnet (chainId: 1328)
- **Sei Mainnet**: EVM mainnet (chainId: 1329)

## License

MIT License - see LICENSE file for details.

## Support

For questions or issues, please refer to the test files for usage examples or create an issue in the repository.
