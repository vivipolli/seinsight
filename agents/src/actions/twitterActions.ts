import { Action } from '@elizaos/core';
import { twitterMockData } from '../mocks/twitterMockData.js';

// This is a simulation of the Twitter data collection action.
// In production, we would use the hashtags from the hashtagsProvider to collect twitter data
// For now, we use mock data

export const collectTwitterDataAction: Action = {
  name: 'COLLECT_TWITTER_DATA',
  description: 'Collect Twitter data using hashtags and topics for analysis',

  validate: async (runtime, message) => { return true; },

  handler: async (runtime, message) => {
    try {
      const content = typeof message.content === 'string' ? message.content : JSON.stringify(message.content);
      const hashtags = content?.split(' ').filter(word => word.startsWith('#'));     

      // In production, we would use the hashtags from the hashtagsProvider to collect twitter data
      // For now, we use mock data
      const mockTweets = twitterMockData.tweets;
      
      // Calculate engagement metrics from mock data
      const totalLikes = mockTweets.reduce((sum, tweet) => sum + tweet.like_count, 0);
      const totalRetweets = mockTweets.reduce((sum, tweet) => sum + tweet.retweet_count, 0);
      const totalEngagement = totalLikes + totalRetweets;
      
      let responseText = `🐦 Twitter Data Collected\n\n`;
      responseText += `Posts: ${mockTweets.length}\n`;
      responseText += `Engagement: ${totalEngagement}\n`;
      responseText += `Hashtags: ${hashtags?.join(', ')}\n`;

      return { 
        success: true, 
        text: responseText,
        values: {
          hashtags: hashtags || [],
          twitterData: mockTweets.slice(0, 3) // TODO: Remove this once we have real data
        }
      };
    } catch (error) {
      console.error('❌ Error collecting Twitter data:', error);
      return { success: false, text: "❌ Error collecting Twitter data. Please try again." };
    }
  }
};
