import { ORACLE_CONFIG, ORACLE_ABI, getExplorerUrl } from '../contracts/oracleConfig';

// Types
export interface SignalBatch {
  windowStart: number;
  windowEnd: number;
  top3Signals: [string, string, string];
  cid: string;
  source: string;
}

export interface PublishedBatch extends SignalBatch {
  batchId: number;
  publisher: string;
  publishedAt: number;
  verified: boolean;
  txHash?: string;
  blockNumber?: number;
}

// Blockchain Service Class
export class BlockchainService {
  private contractAddress: string;
  private rpcUrl: string;
  private privateKey: string | null;

  constructor() {
    this.contractAddress = ORACLE_CONFIG.contractAddress;
    this.rpcUrl = ORACLE_CONFIG.network.rpcUrl;
    this.privateKey = process.env.PRIVATE_KEY || null;
  }

  /**
   * Publish signal batch to blockchain (REAL implementation)
   */
  async publishSignalBatch(batch: SignalBatch): Promise<PublishedBatch> {
    try {
      if (!this.privateKey) {
        throw new Error('Private key not configured in environment');
      }

      // Real implementation with ethers.js
      const { ethers } = await import('ethers');
      const provider = new ethers.JsonRpcProvider(this.rpcUrl);
      
      // Add 0x prefix if not present
      const privateKeyWithPrefix = this.privateKey.startsWith('0x') ? this.privateKey : `0x${this.privateKey}`;
      const wallet = new ethers.Wallet(privateKeyWithPrefix, provider);
      const contract = new ethers.Contract(this.contractAddress, ORACLE_ABI, wallet);
      
      // Check balance
      const balance = await provider.getBalance(wallet.address);
      
      if (balance < ethers.parseEther('0.01')) {
        throw new Error('Insufficient SEI balance for transaction');
      }
      
      // Publish to contract
      const tx = await contract.publishSignalBatch(
        batch.windowStart,
        batch.windowEnd,
        batch.top3Signals,
        batch.cid,
        batch.source
      );
      
      console.log('🔗 Blockchain: Transaction sent, hash:', tx.hash);
      console.log('🔗 Blockchain: Waiting for confirmation...');
      
      const receipt = await tx.wait();
      console.log('🔗 Blockchain: Transaction confirmed in block:', receipt.blockNumber);
      
      // Extract batch ID from event logs
      const event = receipt.logs.find((log: any) => log.fragment?.name === 'SignalBatchPublished');
      
      if (!event) {
        throw new Error('Transaction succeeded but SignalBatchPublished event not found');
      }
      
      const batchId = Number(event.args[0]);
      console.log('🔗 Blockchain: Batch ID extracted:', batchId);
      
      const publishedBatch: PublishedBatch = {
        ...batch,
        batchId,
        publisher: wallet.address,
        publishedAt: Math.floor(Date.now() / 1000),
        verified: false,
        txHash: tx.hash,
        blockNumber: receipt.blockNumber
      };

      console.log('🔗 Blockchain: Publication completed successfully!');
      return publishedBatch;
    } catch (error) {
      console.error('❌ Failed to publish signal batch:', error);
      throw new Error(`Blockchain publication failed: ${error}`);
    }
  }

  /**
   * Get latest signals from the contract (REAL implementation)
   */
  async getLatestSignals(): Promise<{ signals: string[], cid: string, timestamp: number } | null> {
    try {
      const { ethers } = await import('ethers');
      const provider = new ethers.JsonRpcProvider(this.rpcUrl);
      const contract = new ethers.Contract(this.contractAddress, ORACLE_ABI, provider);
      
      // Call getLatestSignals function
      const [signals, cid, windowEnd] = await contract.getLatestSignals();
      
      return { 
        signals: Array.from(signals), 
        cid, 
        timestamp: Number(windowEnd) 
      };
    } catch (error) {
      console.error('❌ Failed to get latest signals:', error);
      // Return null if contract call fails (might be empty contract)
      return null;
    }
  }

  /**
   * Get batch count from contract (REAL implementation)
   */
  async getBatchCount(): Promise<number> {
    try {
      console.log('🔍 Fetching batch count from contract...');
      
      const { ethers } = await import('ethers');
      const provider = new ethers.JsonRpcProvider(this.rpcUrl);
      const contract = new ethers.Contract(this.contractAddress, ORACLE_ABI, provider);
      
      const count = await contract.getBatchCount();
      const batchCount = Number(count);
      
      console.log('✅ Batch count retrieved:', batchCount);
      return batchCount;
    } catch (error) {
      console.error('❌ Failed to get batch count:', error);
      return 0;
    }
  }

  /**
   * Validate if we can connect to the network (REAL implementation)
   */
  async validateConnection(): Promise<boolean> {
    try {
      console.log('🔍 Validating blockchain connection...');
      console.log('├── Network:', ORACLE_CONFIG.network.name);
      console.log('├── RPC URL:', this.rpcUrl);
      console.log('└── Contract:', this.contractAddress);
      
      const { ethers } = await import('ethers');
      const provider = new ethers.JsonRpcProvider(this.rpcUrl);
      
      // Test network connection
      const network = await provider.getNetwork();
      console.log('├── Connected to chain ID:', network.chainId.toString());
      
      // Test contract exists
      const code = await provider.getCode(this.contractAddress);
      if (code === '0x') {
        throw new Error('Contract not found at specified address');
      }
      
      console.log('✅ Blockchain connection validated');
      console.log('└── Contract exists and is deployed');
      return true;
    } catch (error) {
      console.error('❌ Blockchain connection failed:', error);
      return false;
    }
  }

  /**
   * Get contract information
   */
  getContractInfo() {
    return {
      address: this.contractAddress,
      network: ORACLE_CONFIG.network.name,
      chainId: ORACLE_CONFIG.network.chainId,
      explorer: `${ORACLE_CONFIG.network.explorer}/address/${this.contractAddress}`,
      deployer: ORACLE_CONFIG.ownerAddress
    };
  }
}

// Export singleton instance
export const blockchainService = new BlockchainService();
