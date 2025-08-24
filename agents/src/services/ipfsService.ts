import crypto from 'crypto';

export interface TwitterDataHash {
  dataHash: string;
  cid: string;
  timestamp: number;
  tweetCount: number;
  totalEngagement: number;
}

export class IPFSService {
  /**
   * Generate hash from Twitter data and simulate IPFS upload
   */
  static async hashAndUploadTwitterData(twitterData: any): Promise<TwitterDataHash> {
    try {
      console.log('🔐 Generating hash from Twitter data...');
      
      // Create a clean data object for hashing (remove sensitive fields)
      const cleanData = {
        tweets: twitterData.tweets.map((tweet: any) => ({
          id: tweet.id,
          text: tweet.text,
          created_at: tweet.created_at,
          retweet_count: tweet.retweet_count,
          like_count: tweet.like_count,
          user: tweet.user // Keep user for verification but could be anonymized
        })),
        totalEngagement: twitterData.totalEngagement,
        totalLikes: twitterData.totalLikes,
        totalRetweets: twitterData.totalRetweets,
        hashtags: twitterData.hashtags,
        collectedAt: twitterData.collectedAt
      };

      // Generate SHA256 hash of the data
      const dataString = JSON.stringify(cleanData, null, 0);
      const dataHash = crypto.createHash('sha256').update(dataString).digest('hex');
      
      console.log('📊 Data hash generated:', dataHash.substring(0, 16) + '...');
      console.log('📊 Tweet count:', cleanData.tweets.length);
      console.log('📊 Total engagement:', cleanData.totalEngagement);

      // Simulate IPFS upload (in real implementation, this would upload to IPFS)
      const cid = this.generateMockCID(dataHash);
      
      const result: TwitterDataHash = {
        dataHash,
        cid,
        timestamp: Math.floor(Date.now() / 1000),
        tweetCount: cleanData.tweets.length,
        totalEngagement: cleanData.totalEngagement
      };

      console.log('📤 Simulated IPFS upload completed');
      console.log('🔗 CID:', cid);
      console.log('⏰ Timestamp:', new Date(result.timestamp * 1000).toISOString());

      return result;
    } catch (error) {
      console.error('❌ Error in hashAndUploadTwitterData:', error);
      throw error;
    }
  }

  /**
   * Generate a mock CID based on the data hash
   */
  private static generateMockCID(dataHash: string): string {
    // In real implementation, this would be the actual IPFS CID
    // For now, we'll create a deterministic mock CID based on the hash
    const shortHash = dataHash.substring(0, 16);
    const timestamp = Date.now().toString(36);
    return `bafybeig${shortHash}${timestamp.substring(0, 8)}`;
  }

  /**
   * Verify data integrity by comparing hash
   */
  static verifyDataIntegrity(originalData: any, storedHash: string): boolean {
    try {
      const cleanData = {
        tweets: originalData.tweets.map((tweet: any) => ({
          id: tweet.id,
          text: tweet.text,
          created_at: tweet.created_at,
          retweet_count: tweet.retweet_count,
          like_count: tweet.like_count,
          user: tweet.user
        })),
        totalEngagement: originalData.totalEngagement,
        totalLikes: originalData.totalLikes,
        totalRetweets: originalData.totalRetweets,
        hashtags: originalData.hashtags,
        collectedAt: originalData.collectedAt
      };

      const dataString = JSON.stringify(cleanData, null, 0);
      const currentHash = crypto.createHash('sha256').update(dataString).digest('hex');
      
      const isValid = currentHash === storedHash;
      console.log('🔍 Data integrity verification:', isValid ? '✅ Valid' : '❌ Invalid');
      
      return isValid;
    } catch (error) {
      console.error('❌ Error verifying data integrity:', error);
      return false;
    }
  }
}
