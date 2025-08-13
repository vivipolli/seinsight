// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./AchievementNFT.sol";

contract MilestoneRegistry is Ownable, AccessControl {
    bytes32 public constant MILESTONE_REGISTRAR_ROLE =
        keccak256("MILESTONE_REGISTRAR_ROLE");

    AchievementNFT public achievementNFT;

    struct Milestone {
        string projectId;
        string milestoneType;
        uint256 timestamp;
        bytes32 payloadHash;
        bool exists;
    }

    mapping(string => Milestone[]) private projectMilestones;
    mapping(string => mapping(string => mapping(uint256 => mapping(bytes32 => bool))))
        private milestoneExists;

    event MilestoneRegistered(
        string indexed projectId,
        string milestoneType,
        uint256 timestamp,
        bytes32 payloadHash,
        address indexed registrant
    );

    event NFTMinted(
        string indexed projectId,
        string milestoneType,
        uint256 timestamp,
        address indexed recipient,
        uint256 tokenId
    );

    constructor(address _achievementNFT) Ownable(msg.sender) {
        achievementNFT = AchievementNFT(_achievementNFT);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MILESTONE_REGISTRAR_ROLE, msg.sender);
    }

    function registerMilestone(
        string memory projectId,
        string memory milestoneType,
        uint256 timestamp,
        bytes32 payloadHash
    ) internal {
        require(bytes(projectId).length > 0, "Project ID cannot be empty");
        require(
            bytes(milestoneType).length > 0,
            "Milestone type cannot be empty"
        );
        require(timestamp > 0, "Timestamp must be greater than 0");
        require(
            !milestoneExists[projectId][milestoneType][timestamp][payloadHash],
            "Milestone already exists"
        );

        Milestone memory newMilestone = Milestone({
            projectId: projectId,
            milestoneType: milestoneType,
            timestamp: timestamp,
            payloadHash: payloadHash,
            exists: true
        });

        projectMilestones[projectId].push(newMilestone);
        milestoneExists[projectId][milestoneType][timestamp][
            payloadHash
        ] = true;

        emit MilestoneRegistered(
            projectId,
            milestoneType,
            timestamp,
            payloadHash,
            msg.sender
        );
    }

    function registerMilestonePublic(
        string memory projectId,
        string memory milestoneType,
        uint256 timestamp,
        bytes32 payloadHash
    ) external onlyRole(MILESTONE_REGISTRAR_ROLE) {
        registerMilestone(projectId, milestoneType, timestamp, payloadHash);
    }

    function registerMilestoneWithNFT(
        string memory projectId,
        string memory milestoneType,
        uint256 timestamp,
        bytes32 payloadHash,
        address nftRecipient,
        string memory tokenURI
    ) external onlyRole(MILESTONE_REGISTRAR_ROLE) {
        registerMilestone(projectId, milestoneType, timestamp, payloadHash);

        if (nftRecipient != address(0)) {
            uint256 tokenId = achievementNFT.mintNFT(
                nftRecipient,
                projectId,
                milestoneType,
                timestamp,
                tokenURI
            );

            emit NFTMinted(
                projectId,
                milestoneType,
                timestamp,
                nftRecipient,
                tokenId
            );
        }
    }

    function getMilestonesByProject(
        string memory projectId
    ) external view returns (Milestone[] memory) {
        return projectMilestones[projectId];
    }

    function getMilestoneCount(
        string memory projectId
    ) external view returns (uint256) {
        return projectMilestones[projectId].length;
    }

    function getMilestoneAtIndex(
        string memory projectId,
        uint256 index
    ) external view returns (Milestone memory) {
        require(
            index < projectMilestones[projectId].length,
            "Index out of bounds"
        );
        return projectMilestones[projectId][index];
    }

    function checkMilestoneExists(
        string memory projectId,
        string memory milestoneType,
        uint256 timestamp,
        bytes32 payloadHash
    ) external view returns (bool) {
        return
            milestoneExists[projectId][milestoneType][timestamp][payloadHash];
    }

    function grantRegistrarRole(
        address account
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(MILESTONE_REGISTRAR_ROLE, account);
    }

    function revokeRegistrarRole(
        address account
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(MILESTONE_REGISTRAR_ROLE, account);
    }

    function updateAchievementNFT(address newNFTContract) external onlyOwner {
        achievementNFT = AchievementNFT(newNFTContract);
    }
}
