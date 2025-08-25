import { Action, ModelType } from '@elizaos/core';
import { blockchainService, type SignalBatch } from '../services/blockchainService';
import { getExplorerUrl, ORACLE_CONFIG } from '../contracts/oracleConfig';
import { IPFSService, type TwitterDataHash } from '../services/ipfsService';
import { twitterMockData } from '../mocks/twitterMockData.js';

// Contract validation function
const validateSignalBatch = (signalBatch: SignalBatch): void => {
  const now = Math.floor(Date.now() / 1000);
  
  // Contract validations from CommunitySignalOracle.sol
  if (signalBatch.windowStart >= signalBatch.windowEnd) {
    throw new Error('Invalid time window: windowStart must be before windowEnd');
  }
  
  if (signalBatch.windowEnd > now) {
    throw new Error('Window end cannot be in the future');
  }
  
  if (!signalBatch.cid || signalBatch.cid.length === 0) {
    throw new Error('CID cannot be empty');
  }
  
  if (!signalBatch.top3Signals || signalBatch.top3Signals.length !== 3) {
    throw new Error('Must have exactly 3 signals');
  }
  
  for (let i = 0; i < 3; i++) {
    if (!signalBatch.top3Signals[i] || signalBatch.top3Signals[i].length === 0) {
      throw new Error(`Signal ${i + 1} cannot be empty`);
    }
  }
  
  if (!signalBatch.source || signalBatch.source.length === 0) {
    throw new Error('Source cannot be empty');
  }
};

export const generateTop3SignalsAction: Action = {
  name: 'GENERATE_TOP3_SIGNALS',
  description: 'Generate top 3 community signals from social media data for oracle publication',

  validate: async (runtime, message) => {
    return true;
  },

  handler: async (runtime, message, state, options, callback) => {
    try {
      
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

      
      const topSignals = [
        `Sentiment: ${positiveTweets}/${twitterData.tweets.length} positive sentiment`,
        `Community Engagement: ${avgEngagement.toFixed(1)} avg likes/retweets`,
        `Privacy Focus: ${twitterData.tweets.filter((t: any) => t.text.toLowerCase().includes('privacy')).length} mentions`
      ];
      
      const signalBatch: SignalBatch = {
        windowStart: Math.floor(Date.now() / 1000) - 7200, 
        windowEnd: Math.floor(Date.now() / 1000) - 60, // 1 minute ago (ensure it's in the past)
        top3Signals: topSignals as [string, string, string],
        cid: twitterDataHash.cid,
        source: "twitter"
      };

      validateSignalBatch(signalBatch);

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

      const oraclePrompt = `You are a blockchain oracle agent. Format the following blockchain transaction data into a clear verification response.

        Blockchain Data:
        - Tweet Count: ${twitterData.tweets.length}
        - Total Engagement: ${totalEngagement}
        - Data Hash: ${twitterDataHash.dataHash.substring(0, 16)}...
        - Batch ID: ${publishedBatch.batchId}
        - Transaction Hash: ${publishedBatch.txHash}
        - Verify URL: ${getExplorerUrl(publishedBatch.txHash)}

        Format the response exactly as:
        🔮 Blockchain Verification Data

        Data: [tweet count] tweets, [engagement] engagement
        Hash: [first 16 chars of hash]...
        Batch ID: [batch id]
        Tx: [transaction hash]
        Verify: [verify url]

        Return ONLY this formatted response, no additional text.`;

      const formattedResponse = await runtime.useModel(ModelType.TEXT_LARGE, {
        prompt: oraclePrompt
      });

      const updatedSettings = (runtime.character as any).settings || {};
      updatedSettings.latestPublishedBatch = publishedBatch;
      updatedSettings.latestSignals = signalBatch.top3Signals;
      (runtime.character as any).settings = updatedSettings;

      await callback?.({
        text: formattedResponse,
        source: message.content.source,
      });

      return { success: true, text: formattedResponse };
    } catch (error) {
      console.error('🔮 Oracle Action: Error occurred:', error);
      return { success: false, text: '❌ Error generating top 3 signals. Please try again.' };
    }
  }
};
