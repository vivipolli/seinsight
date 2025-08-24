// Oracle Contract Configuration
export const ORACLE_CONFIG = {
  // Contract deployed on Sei Testnet
  contractAddress: '0x7215b3A349b19ba21a6F34C5F092390c93027a2b',
  
  // Network configuration
  network: {
    name: 'sei-testnet',
    chainId: 1328,
    rpcUrl: 'https://evm-rpc-testnet.sei-apis.com',
    explorer: 'https://seitrace.com'
  },
  
  // Owner/Deployer address
  ownerAddress: '0x490A1814Bd4b99Ae4730Bf3acf82Cd7a5257CD33',
  
  // Deployment information
  deployment: {
    txHash: '0x57d290878dedc3bc35c5ba2b513bc7c34d34107c38eb689f1fe5729aafb990fa',
    blockNumber: null, // Will be filled when we get block number
    deploymentTime: '2025-08-22T12:25:59.682Z',
    gasUsed: 2154317
  }
};

// Contract ABI (simplified for the functions we need)
export const ORACLE_ABI = [
  // publishSignalBatch function
  {
    "inputs": [
      {"name": "windowStart", "type": "uint64"},
      {"name": "windowEnd", "type": "uint64"},
      {"name": "top3Signals", "type": "string[3]"},
      {"name": "cid", "type": "string"},
      {"name": "source", "type": "string"}
    ],
    "name": "publishSignalBatch",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  
  // getBatch function
  {
    "inputs": [{"name": "batchId", "type": "uint256"}],
    "name": "getBatch",
    "outputs": [{
      "components": [
        {"name": "windowStart", "type": "uint64"},
        {"name": "windowEnd", "type": "uint64"},
        {"name": "top3Signals", "type": "string[3]"},
        {"name": "cid", "type": "string"},
        {"name": "source", "type": "string"},
        {"name": "publisher", "type": "address"},
        {"name": "publishedAt", "type": "uint64"},
        {"name": "verified", "type": "bool"}
      ],
      "name": "",
      "type": "tuple"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  
  // getLatestSignals function
  {
    "inputs": [],
    "name": "getLatestSignals",
    "outputs": [
      {"name": "top3Signals", "type": "string[3]"},
      {"name": "cid", "type": "string"},
      {"name": "windowEnd", "type": "uint64"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  
  // getBatchCount function
  {
    "inputs": [],
    "name": "getBatchCount",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  
  // Events
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "batchId", "type": "uint256"},
      {"indexed": false, "name": "windowStart", "type": "uint64"},
      {"indexed": false, "name": "windowEnd", "type": "uint64"},
      {"indexed": false, "name": "top3Signals", "type": "string[3]"},
      {"indexed": false, "name": "cid", "type": "string"},
      {"indexed": false, "name": "source", "type": "string"},
      {"indexed": true, "name": "publisher", "type": "address"}
    ],
    "name": "SignalBatchPublished",
    "type": "event"
  }
];

// Helper functions
export const getExplorerUrl = (txHash: string) => 
  `${ORACLE_CONFIG.network.explorer}/tx/${txHash}?chain=atlantic-2`;

export const getContractUrl = () => 
  `${ORACLE_CONFIG.network.explorer}/address/${ORACLE_CONFIG.contractAddress}?chain=atlantic-2`;
