// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AchievementNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _tokenIds;

    struct AchievementMetadata {
        string projectId;
        string milestoneType;
        uint256 timestamp;
        uint256 tokenId;
    }

    mapping(uint256 => AchievementMetadata) public achievementMetadata;
    mapping(string => uint256[]) public projectAchievements;

    event AchievementMinted(
        uint256 indexed tokenId,
        string indexed projectId,
        string milestoneType,
        uint256 timestamp,
        address indexed recipient
    );

    constructor() ERC721("Achievement NFT", "ACHIEVE") Ownable(msg.sender) {
        _tokenIds = 0;
    }

    function mintNFT(
        address recipient,
        string memory projectId,
        string memory milestoneType,
        uint256 timestamp,
        string memory uri
    ) external onlyOwner returns (uint256) {
        require(recipient != address(0), "Invalid recipient address");
        require(bytes(projectId).length > 0, "Project ID cannot be empty");
        require(
            bytes(milestoneType).length > 0,
            "Milestone type cannot be empty"
        );
        require(timestamp > 0, "Timestamp must be greater than 0");

        _tokenIds++;
        uint256 newTokenId = _tokenIds;

        _mint(recipient, newTokenId);
        _setTokenURI(newTokenId, uri);

        AchievementMetadata memory metadata = AchievementMetadata({
            projectId: projectId,
            milestoneType: milestoneType,
            timestamp: timestamp,
            tokenId: newTokenId
        });

        achievementMetadata[newTokenId] = metadata;
        projectAchievements[projectId].push(newTokenId);

        emit AchievementMinted(
            newTokenId,
            projectId,
            milestoneType,
            timestamp,
            recipient
        );

        return newTokenId;
    }

    function getAchievementMetadata(
        uint256 tokenId
    ) external view returns (AchievementMetadata memory) {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        return achievementMetadata[tokenId];
    }

    function getProjectAchievements(
        string memory projectId
    ) external view returns (uint256[] memory) {
        return projectAchievements[projectId];
    }

    function getProjectAchievementCount(
        string memory projectId
    ) external view returns (uint256) {
        return projectAchievements[projectId].length;
    }

    function getAchievementAtIndex(
        string memory projectId,
        uint256 index
    ) external view returns (uint256) {
        require(
            index < projectAchievements[projectId].length,
            "Index out of bounds"
        );
        return projectAchievements[projectId][index];
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
