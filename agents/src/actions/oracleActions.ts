import { Action } from '@elizaos/core';
import { blockchainService, type SignalBatch } from '../services/blockchainService';
import { ORACLE_CONFIG } from '../contracts/oracleConfig';
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
      
      const topHashtags = Array.from(hashtagCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([hashtag]) => hashtag);
      
      while (topHashtags.length < 3) {
        topHashtags.push(`#Signal${topHashtags.length + 1}`);
      }
      
      const signalBatch: SignalBatch = {
        windowStart: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
        windowEnd: Math.floor(Date.now() / 1000), // now
        top3Signals: topHashtags as [string, string, string],
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
      responseText += `🏆 **Top 3 Hashtags:**\n`;
      signalBatch.top3Signals.forEach((hashtag: string, index: number) => {
        const count = hashtagCounts.get(hashtag) || 0;
        responseText += `${index + 1}. **${hashtag}** (${count} mentions)\n`;
      });
      responseText += '\n';

      responseText += `📊 **Blockchain Publication:**\n`;
      responseText += `└ Batch ID: ${publishedBatch.batchId}\n`;
      responseText += `└ CID: \`${publishedBatch.cid}\`\n`;
      responseText += `└ Tx Hash: \`${publishedBatch.txHash}\`\n\n`;

      responseText += `🔗 **Verify:** ${ORACLE_CONFIG.network.explorer}/tx/${publishedBatch.txHash}\n`;

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
