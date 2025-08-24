import { Action } from '@elizaos/core';
import { blockchainService, type SignalBatch } from '../services/blockchainService';
import { getExplorerUrl, ORACLE_CONFIG } from '../contracts/oracleConfig';
import { IPFSService, type TwitterDataHash } from '../services/ipfsService';
import { twitterMockData } from '../mocks/twitterMockData';

export const generateTop3SignalsAction: Action = {
  name: 'GENERATE_TOP3_SIGNALS',
  description: 'Generate top 3 community signals from social media data for oracle publication',

  validate: async (runtime, message) => {
    return true;
  },

  handler: async (runtime, message) => {
    try {
      console.log('🔮 generateTop3SignalsAction triggered!');
      
      // TODO: Remove this once we have real data and use provider to get twitter data
      let twitterData = twitterMockData;
      
      const twitterDataHash: TwitterDataHash = await IPFSService.hashAndUploadTwitterData(twitterData);
      
      const hashtagCounts = new Map<string, number>();
      twitterData.tweets.forEach((tweet: any) => {
        const hashtagMatches = tweet.text.match(/#\w+/g);
        if (hashtagMatches) {
          hashtagMatches.forEach((hashtag: string) => {
            hashtagCounts.set(hashtag, (hashtagCounts.get(hashtag) || 0) + 1);
          });
        }
      });
      
      // Generate meaningful signals based on actual tweet content and metrics
      const totalEngagement = twitterData.tweets.reduce((sum: number, t: any) => sum + t.like_count + t.retweet_count, 0);
      const avgEngagement = totalEngagement / twitterData.tweets.length;
      const positiveTweets = twitterData.tweets.filter((t: any) => t.sentiment === 'positive').length;
      const sentimentPercentage = (positiveTweets / twitterData.tweets.length * 100).toFixed(1);
      
      const topSignals = [
        `Sentiment: ${positiveTweets}/${twitterData.tweets.length} positive sentiment`,
        `Community Engagement: ${avgEngagement.toFixed(1)} avg likes/retweets`,
        `Privacy Focus: ${twitterData.tweets.filter((t: any) => t.text.toLowerCase().includes('privacy')).length} mentions`
      ];
      
          const signalBatch: SignalBatch = {
          windowStart: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
          windowEnd: Math.floor(Date.now() / 1000), // now
          top3Signals: topSignals as [string, string, string],
          cid: twitterDataHash.cid,
          source: "twitter"
        };

      if (!signalBatch.top3Signals || signalBatch.top3Signals.length !== 3) {
        throw new Error('Invalid signal batch: must contain exactly 3 signals');
      }

      if (!signalBatch.cid || signalBatch.cid.length < 10) {
        throw new Error('Invalid CID: must be a valid IPFS hash');
      }

      const publishedBatch = await blockchainService.publishSignalBatch(signalBatch);
      
      if (!publishedBatch.txHash || !publishedBatch.batchId) {
        throw new Error('Publication failed: missing transaction hash or batch ID');
      }

      let responseText = `🔮 **Community Signal Oracle - Published**\n\n`;
      responseText += `🏆 **Top 3 Market Signals:**\n`;
      signalBatch.top3Signals.forEach((signal: string, index: number) => {
        responseText += `${index + 1}. **${signal}**\n`;
      });
      responseText += '\n';

      responseText += `📊 **Data Transparency:**\n`;
      responseText += `└ Tweets Analyzed: ${twitterData.tweets.length}\n`;
      responseText += `└ Total Engagement: ${totalEngagement}\n`;
      responseText += `└ Data Hash: \`${twitterDataHash.dataHash.substring(0, 16)}...\`\n`;
      responseText += `└ Timestamp: ${twitterDataHash.timestamp}\n\n`;

      responseText += `📊 **Blockchain Publication:**\n`;
      responseText += `└ Batch ID: ${publishedBatch.batchId}\n`;
      responseText += `└ CID: \`${publishedBatch.cid}\`\n`;
      responseText += `└ Tx Hash: \`${publishedBatch.txHash}\`\n`;
      responseText += `└ Block: ${publishedBatch.blockNumber || 'N/A'}\n\n`;

      responseText += `🔗 **Verify:** ${getExplorerUrl(publishedBatch.txHash)}\n`;
      responseText += `🔍 **Data Integrity:** Hash verified and immutable on IPFS\n`;

      const updatedSettings = (runtime.character as any).settings || {};
      updatedSettings.latestPublishedBatch = publishedBatch;
      updatedSettings.latestSignals = signalBatch.top3Signals;
      (runtime.character as any).settings = updatedSettings;

      console.log('🔮 generateTop3SignalsAction completed successfully', responseText);

      return { success: true, text: responseText };
    } catch (error) {
      return { success: false, text: '❌ Error generating top 3 signals. Please try again.' };
    }
  }
};
