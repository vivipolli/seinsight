// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title CommunitySignalOracle
 * @dev Oracle that stores top 3 community signals per time window with IPFS evidence
 * @notice This contract enables transparent and verifiable social media signal tracking for Web3
 */
contract CommunitySignalOracle is Ownable, ReentrancyGuard {
    // Struct to store signal batch data
    struct SignalBatch {
        uint64 windowStart; // Start timestamp of the analysis window
        uint64 windowEnd; // End timestamp of the analysis window
        string[3] top3Signals; // Top 3 signals (hashtags/topics)
        string cid; // IPFS CID containing evidence batch
        string source; // Data source (e.g., "twitter")
        address publisher; // Address that published this batch
        uint64 publishedAt; // Block timestamp when published
        bool verified; // Whether batch has been verified
    }

    // State variables
    SignalBatch[] public batches;
    mapping(address => bool) public authorizedPublishers;
    mapping(string => uint256) public cidToBatchId;

    // Events
    event SignalBatchPublished(
        uint256 indexed batchId,
        uint64 windowStart,
        uint64 windowEnd,
        string[3] top3Signals,
        string cid,
        string source,
        address indexed publisher
    );

    event BatchVerified(uint256 indexed batchId, address indexed verifier);
    event PublisherAuthorized(address indexed publisher, bool authorized);

    // Modifiers
    modifier onlyAuthorizedPublisher() {
        require(
            authorizedPublishers[msg.sender] || msg.sender == owner(),
            "Not authorized to publish"
        );
        _;
    }

    modifier validBatchId(uint256 batchId) {
        require(batchId < batches.length, "Invalid batch ID");
        _;
    }

    constructor(address initialOwner) Ownable(initialOwner) {
        // Owner is automatically authorized to publish
        authorizedPublishers[initialOwner] = true;
    }

    /**
     * @dev Publish a new signal batch to the oracle
     * @param windowStart Start timestamp of analysis window
     * @param windowEnd End timestamp of analysis window
     * @param top3Signals Array of exactly 3 top signals
     * @param cid IPFS CID containing evidence batch
     * @param source Data source identifier
     * @return batchId The ID of the published batch
     */
    function publishSignalBatch(
        uint64 windowStart,
        uint64 windowEnd,
        string[3] calldata top3Signals,
        string calldata cid,
        string calldata source
    ) external onlyAuthorizedPublisher nonReentrant returns (uint256) {
        require(windowStart < windowEnd, "Invalid time window");
        require(
            windowEnd <= block.timestamp,
            "Window end cannot be in the future"
        );
        require(bytes(cid).length > 0, "CID cannot be empty");
        require(
            cidToBatchId[cid] == 0 &&
                (batches.length == 0 ||
                    keccak256(bytes(batches[0].cid)) != keccak256(bytes(cid))),
            "CID already exists"
        );

        // Validate signals are not empty
        for (uint i = 0; i < 3; i++) {
            require(bytes(top3Signals[i]).length > 0, "Signal cannot be empty");
        }

        uint256 batchId = batches.length;

        batches.push(
            SignalBatch({
                windowStart: windowStart,
                windowEnd: windowEnd,
                top3Signals: top3Signals,
                cid: cid,
                source: source,
                publisher: msg.sender,
                publishedAt: uint64(block.timestamp),
                verified: false
            })
        );

        cidToBatchId[cid] = batchId + 1; // Store as batchId + 1 to avoid confusion with default 0

        emit SignalBatchPublished(
            batchId,
            windowStart,
            windowEnd,
            top3Signals,
            cid,
            source,
            msg.sender
        );

        return batchId;
    }

    /**
     * @dev Verify a published batch (can be called by owner or community)
     * @param batchId ID of the batch to verify
     */
    function verifyBatch(uint256 batchId) external validBatchId(batchId) {
        require(
            msg.sender == owner() || authorizedPublishers[msg.sender],
            "Not authorized to verify"
        );
        require(!batches[batchId].verified, "Batch already verified");

        batches[batchId].verified = true;

        emit BatchVerified(batchId, msg.sender);
    }

    /**
     * @dev Authorize or revoke publisher permissions
     * @param publisher Address to authorize/revoke
     * @param authorized Whether to authorize (true) or revoke (false)
     */
    function setPublisherAuthorization(
        address publisher,
        bool authorized
    ) external onlyOwner {
        require(publisher != address(0), "Invalid publisher address");
        authorizedPublishers[publisher] = authorized;

        emit PublisherAuthorized(publisher, authorized);
    }

    /**
     * @dev Get batch by ID
     * @param batchId ID of the batch to retrieve
     * @return The SignalBatch struct
     */
    function getBatch(
        uint256 batchId
    ) external view validBatchId(batchId) returns (SignalBatch memory) {
        return batches[batchId];
    }

    /**
     * @dev Get batch by CID
     * @param cid IPFS CID to lookup
     * @return The SignalBatch struct
     */
    function getBatchByCID(
        string calldata cid
    ) external view returns (SignalBatch memory) {
        uint256 batchIdPlusOne = cidToBatchId[cid];
        require(batchIdPlusOne > 0, "CID not found");
        return batches[batchIdPlusOne - 1];
    }

    /**
     * @dev Get latest batch
     * @return The most recent SignalBatch struct
     */
    function getLatestBatch() external view returns (SignalBatch memory) {
        require(batches.length > 0, "No batches published");
        return batches[batches.length - 1];
    }

    /**
     * @dev Get total number of published batches
     * @return Total batch count
     */
    function getBatchCount() external view returns (uint256) {
        return batches.length;
    }

    /**
     * @dev Get batches within a time range
     * @param startTime Start timestamp (inclusive)
     * @param endTime End timestamp (inclusive)
     * @param maxResults Maximum number of results to return
     * @return batchIds Array of batch IDs within the time range
     */
    function getBatchesInTimeRange(
        uint64 startTime,
        uint64 endTime,
        uint256 maxResults
    ) external view returns (uint256[] memory batchIds) {
        require(startTime <= endTime, "Invalid time range");
        require(maxResults > 0 && maxResults <= 100, "Invalid maxResults");

        uint256[] memory tempResults = new uint256[](maxResults);
        uint256 count = 0;

        // Search backwards from latest batch
        for (uint256 i = batches.length; i > 0 && count < maxResults; i--) {
            uint256 batchId = i - 1;
            SignalBatch storage batch = batches[batchId];

            if (batch.windowStart >= startTime && batch.windowEnd <= endTime) {
                tempResults[count] = batchId;
                count++;
            }
        }

        // Create array with exact size
        batchIds = new uint256[](count);
        for (uint256 j = 0; j < count; j++) {
            batchIds[j] = tempResults[j];
        }

        return batchIds;
    }

    /**
     * @dev Get signals from latest batch for quick access
     * @return top3Signals Array of the 3 most recent signals
     * @return cid IPFS CID of the evidence
     * @return windowEnd Timestamp of the analysis window end
     */
    function getLatestSignals()
        external
        view
        returns (
            string[3] memory top3Signals,
            string memory cid,
            uint64 windowEnd
        )
    {
        require(batches.length > 0, "No batches published");
        SignalBatch storage latest = batches[batches.length - 1];
        return (latest.top3Signals, latest.cid, latest.windowEnd);
    }
}
