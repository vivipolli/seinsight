const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MilestoneRegistry and AchievementNFT", function () {
  let milestoneRegistry;
  let achievementNFT;
  let owner;
  let registrar;
  let user;

  beforeEach(async function () {
    [owner, registrar, user] = await ethers.getSigners();

    const AchievementNFT = await ethers.getContractFactory("AchievementNFT");
    achievementNFT = await AchievementNFT.deploy();

    const MilestoneRegistry = await ethers.getContractFactory("MilestoneRegistry");
    milestoneRegistry = await MilestoneRegistry.deploy(await achievementNFT.getAddress());

    // Transfer ownership of AchievementNFT to MilestoneRegistry
    await achievementNFT.transferOwnership(await milestoneRegistry.getAddress());
  });

  describe("MilestoneRegistry", function () {
    it("Should register a milestone successfully", async function () {
      const projectId = "project-123";
      const milestoneType = "development";
      const timestamp = Math.floor(Date.now() / 1000);
      const payloadHash = ethers.keccak256(ethers.toUtf8Bytes("test payload"));

      await expect(
        milestoneRegistry.registerMilestonePublic(projectId, milestoneType, timestamp, payloadHash)
      )
        .to.emit(milestoneRegistry, "MilestoneRegistered")
        .withArgs(projectId, milestoneType, timestamp, payloadHash, owner.address);

      const milestones = await milestoneRegistry.getMilestonesByProject(projectId);
      expect(milestones).to.have.length(1);
      expect(milestones[0].projectId).to.equal(projectId);
      expect(milestones[0].milestoneType).to.equal(milestoneType);
      expect(milestones[0].timestamp).to.equal(timestamp);
      expect(milestones[0].payloadHash).to.equal(payloadHash);
    });

    it("Should prevent duplicate milestone registration", async function () {
      const projectId = "project-123";
      const milestoneType = "development";
      const timestamp = Math.floor(Date.now() / 1000);
      const payloadHash = ethers.keccak256(ethers.toUtf8Bytes("test payload"));

      await milestoneRegistry.registerMilestonePublic(projectId, milestoneType, timestamp, payloadHash);

      await expect(
        milestoneRegistry.registerMilestonePublic(projectId, milestoneType, timestamp, payloadHash)
      ).to.be.revertedWith("Milestone already exists");
    });

    it("Should register milestone with NFT minting", async function () {
      const projectId = "project-123";
      const milestoneType = "milestone";
      const timestamp = Math.floor(Date.now() / 1000);
      const payloadHash = ethers.keccak256(ethers.toUtf8Bytes("test payload"));
      const tokenURI = "ipfs://QmTest123";

      await expect(
        milestoneRegistry.registerMilestoneWithNFT(
          projectId,
          milestoneType,
          timestamp,
          payloadHash,
          user.address,
          tokenURI
        )
      )
        .to.emit(milestoneRegistry, "MilestoneRegistered")
        .to.emit(milestoneRegistry, "NFTMinted");

      const milestones = await milestoneRegistry.getMilestonesByProject(projectId);
      expect(milestones).to.have.length(1);

      const achievements = await achievementNFT.getProjectAchievements(projectId);
      expect(achievements).to.have.length(1);
    });

    it("Should allow role management", async function () {
      await milestoneRegistry.grantRegistrarRole(registrar.address);
      
      const projectId = "project-456";
      const milestoneType = "test";
      const timestamp = Math.floor(Date.now() / 1000);
      const payloadHash = ethers.keccak256(ethers.toUtf8Bytes("test"));

      await milestoneRegistry.connect(registrar).registerMilestonePublic(
        projectId,
        milestoneType,
        timestamp,
        payloadHash
      );

      const milestones = await milestoneRegistry.getMilestonesByProject(projectId);
      expect(milestones).to.have.length(1);
    });

    it("Should prevent unauthorized milestone registration", async function () {
      const projectId = "project-123";
      const milestoneType = "development";
      const timestamp = Math.floor(Date.now() / 1000);
      const payloadHash = ethers.keccak256(ethers.toUtf8Bytes("test payload"));

      await expect(
        milestoneRegistry.connect(user).registerMilestonePublic(projectId, milestoneType, timestamp, payloadHash)
      ).to.be.reverted;
    });

    it("Should get milestone count correctly", async function () {
      const projectId = "project-123";
      const timestamp = Math.floor(Date.now() / 1000);

      await milestoneRegistry.registerMilestonePublic(
        projectId,
        "milestone1",
        timestamp,
        ethers.keccak256(ethers.toUtf8Bytes("payload1"))
      );

      await milestoneRegistry.registerMilestonePublic(
        projectId,
        "milestone2",
        timestamp + 1,
        ethers.keccak256(ethers.toUtf8Bytes("payload2"))
      );

      const count = await milestoneRegistry.getMilestoneCount(projectId);
      expect(count).to.equal(2);
    });

    it("Should get milestone at specific index", async function () {
      const projectId = "project-123";
      const timestamp = Math.floor(Date.now() / 1000);
      const payloadHash = ethers.keccak256(ethers.toUtf8Bytes("test payload"));

      await milestoneRegistry.registerMilestonePublic(
        projectId,
        "milestone1",
        timestamp,
        payloadHash
      );

      const milestone = await milestoneRegistry.getMilestoneAtIndex(projectId, 0);
      expect(milestone.projectId).to.equal(projectId);
      expect(milestone.milestoneType).to.equal("milestone1");
      expect(milestone.timestamp).to.equal(timestamp);
      expect(milestone.payloadHash).to.equal(payloadHash);
    });

    it("Should check milestone exists correctly", async function () {
      const projectId = "project-123";
      const milestoneType = "development";
      const timestamp = Math.floor(Date.now() / 1000);
      const payloadHash = ethers.keccak256(ethers.toUtf8Bytes("test payload"));

      // Check before registration
      const existsBefore = await milestoneRegistry.checkMilestoneExists(
        projectId,
        milestoneType,
        timestamp,
        payloadHash
      );
      expect(existsBefore).to.be.false;

      // Register milestone
      await milestoneRegistry.registerMilestonePublic(
        projectId,
        milestoneType,
        timestamp,
        payloadHash
      );

      // Check after registration
      const existsAfter = await milestoneRegistry.checkMilestoneExists(
        projectId,
        milestoneType,
        timestamp,
        payloadHash
      );
      expect(existsAfter).to.be.true;
    });
  });

  describe("AchievementNFT", function () {
    it("Should mint NFT with correct metadata", async function () {
      const projectId = "project-123";
      const milestoneType = "achievement";
      const timestamp = Math.floor(Date.now() / 1000);
      const tokenURI = "ipfs://QmTest123";

      // Use MilestoneRegistry to mint NFT
      const tokenId = await milestoneRegistry.registerMilestoneWithNFT(
        projectId,
        milestoneType,
        timestamp,
        ethers.keccak256(ethers.toUtf8Bytes("test payload")),
        user.address,
        tokenURI
      );

      expect(await achievementNFT.ownerOf(1)).to.equal(user.address);
      expect(await achievementNFT.tokenURI(1)).to.equal(tokenURI);

      const metadata = await achievementNFT.getAchievementMetadata(1);
      expect(metadata.projectId).to.equal(projectId);
      expect(metadata.milestoneType).to.equal(milestoneType);
      expect(metadata.timestamp).to.equal(timestamp);
    });

    it("Should track project achievements", async function () {
      const projectId = "project-123";
      const tokenURI = "ipfs://QmTest123";

      await milestoneRegistry.registerMilestoneWithNFT(
        projectId,
        "milestone1",
        1000,
        ethers.keccak256(ethers.toUtf8Bytes("payload1")),
        user.address,
        tokenURI
      );
      await milestoneRegistry.registerMilestoneWithNFT(
        projectId,
        "milestone2",
        2000,
        ethers.keccak256(ethers.toUtf8Bytes("payload2")),
        user.address,
        tokenURI
      );

      const achievements = await achievementNFT.getProjectAchievements(projectId);
      expect(achievements).to.have.length(2);
      expect(await achievementNFT.getProjectAchievementCount(projectId)).to.equal(2);
    });

    it("Should prevent non-owner from minting", async function () {
      await expect(
        achievementNFT.connect(user).mintNFT(
          user.address,
          "project-123",
          "milestone",
          1000,
          "ipfs://QmTest123"
        )
      ).to.be.reverted;
    });

    it("Should get achievement metadata correctly", async function () {
      const projectId = "project-123";
      const milestoneType = "test-achievement";
      const timestamp = 1234567890;
      const tokenURI = "ipfs://QmTestMetadata";

      await milestoneRegistry.registerMilestoneWithNFT(
        projectId,
        milestoneType,
        timestamp,
        ethers.keccak256(ethers.toUtf8Bytes("metadata test")),
        user.address,
        tokenURI
      );

      const metadata = await achievementNFT.getAchievementMetadata(1);
      expect(metadata.projectId).to.equal(projectId);
      expect(metadata.milestoneType).to.equal(milestoneType);
      expect(metadata.timestamp).to.equal(timestamp);
      expect(metadata.tokenId).to.equal(1);
    });

    it("Should get achievement at specific index", async function () {
      const projectId = "project-123";
      const tokenURI = "ipfs://QmTest123";

      await milestoneRegistry.registerMilestoneWithNFT(
        projectId,
        "milestone1",
        1000,
        ethers.keccak256(ethers.toUtf8Bytes("payload1")),
        user.address,
        tokenURI
      );

      await milestoneRegistry.registerMilestoneWithNFT(
        projectId,
        "milestone2",
        2000,
        ethers.keccak256(ethers.toUtf8Bytes("payload2")),
        user.address,
        tokenURI
      );

      const tokenId1 = await achievementNFT.getAchievementAtIndex(projectId, 0);
      const tokenId2 = await achievementNFT.getAchievementAtIndex(projectId, 1);

      expect(tokenId1).to.equal(1);
      expect(tokenId2).to.equal(2);
    });

    it("Should revert when getting non-existent token metadata", async function () {
      await expect(
        achievementNFT.getAchievementMetadata(999)
      ).to.be.reverted;
    });
  });

  describe("Integration", function () {
    it("Should work together for milestone registration with NFT", async function () {
      const projectId = "project-integration";
      const milestoneType = "integration-test";
      const timestamp = Math.floor(Date.now() / 1000);
      const payloadHash = ethers.keccak256(ethers.toUtf8Bytes("integration test"));
      const tokenURI = "ipfs://QmIntegration123";

      // Register milestone with NFT
      await milestoneRegistry.registerMilestoneWithNFT(
        projectId,
        milestoneType,
        timestamp,
        payloadHash,
        user.address,
        tokenURI
      );

      // Verify milestone was registered
      const milestones = await milestoneRegistry.getMilestonesByProject(projectId);
      expect(milestones).to.have.length(1);

      // Verify NFT was minted
      const achievements = await achievementNFT.getProjectAchievements(projectId);
      expect(achievements).to.have.length(1);

      const tokenId = achievements[0];
      const metadata = await achievementNFT.getAchievementMetadata(tokenId);
      expect(metadata.projectId).to.equal(projectId);
      expect(metadata.milestoneType).to.equal(milestoneType);
      expect(metadata.timestamp).to.equal(timestamp);
      expect(await achievementNFT.ownerOf(tokenId)).to.equal(user.address);
    });

    it("Should handle multiple projects correctly", async function () {
      const project1 = "project-1";
      const project2 = "project-2";
      const tokenURI = "ipfs://QmTest123";

      // Register milestones for project 1
      await milestoneRegistry.registerMilestonePublic(
        project1,
        "milestone1",
        1000,
        ethers.keccak256(ethers.toUtf8Bytes("project1-milestone1"))
      );

      await milestoneRegistry.registerMilestoneWithNFT(
        project1,
        "milestone2",
        2000,
        ethers.keccak256(ethers.toUtf8Bytes("project1-milestone2")),
        user.address,
        tokenURI
      );

      // Register milestones for project 2
      await milestoneRegistry.registerMilestonePublic(
        project2,
        "milestone1",
        3000,
        ethers.keccak256(ethers.toUtf8Bytes("project2-milestone1"))
      );

      // Verify project 1 has 2 milestones and 1 NFT
      const project1Milestones = await milestoneRegistry.getMilestonesByProject(project1);
      const project1Achievements = await achievementNFT.getProjectAchievements(project1);
      expect(project1Milestones).to.have.length(2);
      expect(project1Achievements).to.have.length(1);

      // Verify project 2 has 1 milestone and 0 NFTs
      const project2Milestones = await milestoneRegistry.getMilestonesByProject(project2);
      const project2Achievements = await achievementNFT.getProjectAchievements(project2);
      expect(project2Milestones).to.have.length(1);
      expect(project2Achievements).to.have.length(0);
    });

    it("Should emit correct events", async function () {
      const projectId = "project-events";
      const milestoneType = "event-test";
      const timestamp = Math.floor(Date.now() / 1000);
      const payloadHash = ethers.keccak256(ethers.toUtf8Bytes("event test"));
      const tokenURI = "ipfs://QmEventTest123";

      await expect(
        milestoneRegistry.registerMilestoneWithNFT(
          projectId,
          milestoneType,
          timestamp,
          payloadHash,
          user.address,
          tokenURI
        )
      )
        .to.emit(milestoneRegistry, "MilestoneRegistered")
        .withArgs(projectId, milestoneType, timestamp, payloadHash, owner.address)
        .and.to.emit(milestoneRegistry, "NFTMinted")
        .withArgs(projectId, milestoneType, timestamp, user.address, 1);
    });
  });
});
