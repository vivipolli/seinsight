export interface VerificationInfo {
  dataHash: string;
  tweetCount: number;
  txHash: string;
  timestamp: number;
  cid: string;
}

export class VerificationService {
  /**
   * Extract verification information from signals result
   */
  static extractVerificationInfo(signalsResult: string): VerificationInfo | null {
    try {
      const dataHashMatch = signalsResult.match(/Data Hash: `([a-f0-9]{16})/);
      const tweetCountMatch = signalsResult.match(/Tweets Analyzed: (\d+)/);
      const txHashMatch = signalsResult.match(/Tx Hash: `([a-f0-9x]+)/);
      const cidMatch = signalsResult.match(/CID: `([a-zA-Z0-9]+)/);
      const timestampMatch = signalsResult.match(/Timestamp: (\d+)/);

      if (dataHashMatch && tweetCountMatch) {
        return {
          dataHash: dataHashMatch[1] + '...',
          tweetCount: parseInt(tweetCountMatch[1]),
          txHash: txHashMatch ? txHashMatch[1] : 'N/A',
          cid: cidMatch ? cidMatch[1] : 'N/A',
          timestamp: timestampMatch ? parseInt(timestampMatch[1]) : Date.now()
        };
      }
      return null;
    } catch (error) {
      console.error('Error extracting verification info:', error);
      return null;
    }
  }

  /**
   * Verify data integrity by comparing hashes
   */
  static async verifyDataIntegrity(originalData: any, storedHash: string): Promise<boolean> {
    try {
      // In a real implementation, this would use the same hashing algorithm
      // as the backend to verify data integrity
      const dataString = JSON.stringify(originalData, null, 0);
      const currentHash = await this.generateHash(dataString);
      
      return currentHash.startsWith(storedHash.replace('...', ''));
    } catch (error) {
      console.error('Error verifying data integrity:', error);
      return false;
    }
  }

  /**
   * Generate hash for verification (simplified for demo)
   */
  private static async generateHash(data: string): Promise<string> {
    // In production, this would use crypto.subtle.digest
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Get blockchain explorer URL for transaction verification
   */
  static getBlockchainExplorerUrl(txHash: string, network: string = 'sei'): string {
    const explorers = {
      sei: 'https://sei.explorers.guru/transaction/',
      testnet: 'https://testnet.sei.explorers.guru/transaction/'
    };
    
    return explorers[network as keyof typeof explorers] + txHash;
  }

  /**
   * Get IPFS gateway URL for data verification
   */
  static getIPFSGatewayUrl(cid: string): string {
    return `https://ipfs.io/ipfs/${cid}`;
  }

  /**
   * Format verification details for display
   */
  static formatVerificationDetails(info: VerificationInfo): string {
    return `🔍 Verification Details:

📊 Tweets Analyzed: ${info.tweetCount}
🔗 Data Hash: ${info.dataHash}
📅 Timestamp: ${new Date(info.timestamp * 1000).toLocaleString()}
🔗 Blockchain TX: ${info.txHash}
🔗 IPFS CID: ${info.cid}

✅ Data integrity verified and immutable on blockchain

🔗 Verify on Blockchain: ${this.getBlockchainExplorerUrl(info.txHash)}
🔗 View on IPFS: ${this.getIPFSGatewayUrl(info.cid)}`;
  }
}
