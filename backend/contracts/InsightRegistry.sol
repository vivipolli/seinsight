// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract InsightRegistry is Ownable, AccessControl {
    bytes32 public constant INSIGHT_PUBLISHER_ROLE =
        keccak256("INSIGHT_PUBLISHER_ROLE");

    struct Insight {
        string projectId;
        string insightType;
        uint256 timestamp;
        bytes32 payloadHash;
        string uri;
        bool exists;
    }

    mapping(string => Insight[]) private projectInsights;
    mapping(string => mapping(string => mapping(uint256 => mapping(bytes32 => bool))))
        private insightExists;

    event InsightRegistered(
        string indexed projectId,
        string insightType,
        uint256 timestamp,
        bytes32 payloadHash,
        string uri,
        address indexed publisher
    );

    event InsightApproved(
        string indexed projectId,
        bytes32 payloadHash,
        address indexed approver,
        uint256 approvalTimestamp
    );

    constructor() Ownable(msg.sender) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(INSIGHT_PUBLISHER_ROLE, msg.sender);
    }

    function registerInsight(
        string memory projectId,
        string memory insightType,
        bytes32 payloadHash,
        string memory uri
    ) external onlyRole(INSIGHT_PUBLISHER_ROLE) {
        require(bytes(projectId).length > 0, "Project ID cannot be empty");
        require(bytes(insightType).length > 0, "Insight type cannot be empty");
        require(payloadHash != bytes32(0), "Payload hash cannot be empty");
        require(
            !insightExists[projectId][insightType][block.timestamp][
                payloadHash
            ],
            "Insight already exists"
        );

        Insight memory newInsight = Insight({
            projectId: projectId,
            insightType: insightType,
            timestamp: block.timestamp,
            payloadHash: payloadHash,
            uri: uri,
            exists: true
        });

        projectInsights[projectId].push(newInsight);
        insightExists[projectId][insightType][block.timestamp][
            payloadHash
        ] = true;

        emit InsightRegistered(
            projectId,
            insightType,
            block.timestamp,
            payloadHash,
            uri,
            msg.sender
        );
    }

    function approveInsight(
        string memory projectId,
        bytes32 payloadHash
    ) external onlyRole(INSIGHT_PUBLISHER_ROLE) {
        require(bytes(projectId).length > 0, "Project ID cannot be empty");
        require(payloadHash != bytes32(0), "Payload hash cannot be empty");

        emit InsightApproved(
            projectId,
            payloadHash,
            msg.sender,
            block.timestamp
        );
    }

    function getInsightsByProject(
        string memory projectId
    ) external view returns (Insight[] memory) {
        return projectInsights[projectId];
    }

    function getInsightCount(
        string memory projectId
    ) external view returns (uint256) {
        return projectInsights[projectId].length;
    }

    function getInsightAtIndex(
        string memory projectId,
        uint256 index
    ) external view returns (Insight memory) {
        require(
            index < projectInsights[projectId].length,
            "Index out of bounds"
        );
        return projectInsights[projectId][index];
    }

    function checkInsightExists(
        string memory projectId,
        string memory insightType,
        uint256 timestamp,
        bytes32 payloadHash
    ) external view returns (bool) {
        return insightExists[projectId][insightType][timestamp][payloadHash];
    }

    function getInsightsByType(
        string memory projectId,
        string memory insightType
    ) external view returns (Insight[] memory) {
        Insight[] memory allInsights = projectInsights[projectId];
        uint256 count = 0;

        // Count matching insights
        for (uint256 i = 0; i < allInsights.length; i++) {
            if (
                keccak256(bytes(allInsights[i].insightType)) ==
                keccak256(bytes(insightType))
            ) {
                count++;
            }
        }

        // Create result array
        Insight[] memory result = new Insight[](count);
        uint256 resultIndex = 0;

        for (uint256 i = 0; i < allInsights.length; i++) {
            if (
                keccak256(bytes(allInsights[i].insightType)) ==
                keccak256(bytes(insightType))
            ) {
                result[resultIndex] = allInsights[i];
                resultIndex++;
            }
        }

        return result;
    }

    function grantPublisherRole(
        address account
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(INSIGHT_PUBLISHER_ROLE, account);
    }

    function revokePublisherRole(
        address account
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(INSIGHT_PUBLISHER_ROLE, account);
    }

    function hasPublisherRole(address account) external view returns (bool) {
        return hasRole(INSIGHT_PUBLISHER_ROLE, account);
    }
}
