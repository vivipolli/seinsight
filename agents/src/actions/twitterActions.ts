import { Action, IAgentRuntime, Memory } from '@elizaos/core';
import { twitterMockData } from '../mocks/twitterMockData.js';
import hashtagsProvider from 'src/providers/keywords-generator.js';

export const collectTwitterDataAction: Action = {
  name: 'COLLECT_TWITTER_DATA',
  description: 'Collect Twitter data using hashtags and topics for analysis',

  validate: async (runtime, message) => {
    console.log('🔍 Validating collectTwitterDataAction...');
    const content = typeof message.content === 'string' ? message.content : JSON.stringify(message.content);
    console.log('🔍 Message content:', content);
    return true;
  },

  handler: async (runtime, message) => {
    try {
      console.log('🐦 collectTwitterDataAction triggered!');
      
      // Get hashtags from character settings or message metadata
      let hashtags = await hashtagsProvider.get(runtime, message, {
        values: { hashtags: [] },
        data: { hashtags: [] },
        text: 'No hashtags found for this user'
      });

      console.log('🔍 Hashtags:', hashtags);

      // In production, we would use the hashtags from the hashtagsProvider to collect twitter data
      // For now, we use mock data
      const mockTweets = twitterMockData.tweets;
      
      // Calculate engagement metrics from mock data
      const totalLikes = mockTweets.reduce((sum, tweet) => sum + tweet.like_count, 0);
      const totalRetweets = mockTweets.reduce((sum, tweet) => sum + tweet.retweet_count, 0);
      const totalEngagement = totalLikes + totalRetweets;
      

      let responseText = `🐦 **Twitter Data Collection Results:**\n\n`;
      responseText += `**Hashtags from HashtagGenerator:** ${hashtags.values?.hashtags.join(', ')}\n`;
      responseText += `**Collection Status:** ✅ Completed (Mock Data)\n`;
      responseText += `**Platforms:** Twitter\n\n`;

      responseText += `📊 **Twitter Data Summary:**\n`;
      responseText += `└ Posts Collected: ${mockTweets.length}\n`;
      responseText += `└ Total Engagement: ${totalEngagement} (${totalLikes} likes, ${totalRetweets} retweets)\n`;
      responseText += `└ Time Range: Last 24 hours\n\n`;

      responseText += `\n📈 **Next Step:** Use "generate top 3 signals" to publish trending signals to the oracle.`;


      return { 
        success: true, 
        text: responseText,
        values: {
          hashtags: hashtags.values?.hashtags || [],
          twitterData: mockTweets.slice(0, 3) // TODO: Remove this once we have real data
        }
      };
    } catch (error) {
      console.error('❌ Error collecting Twitter data:', error);
      return { success: false, text: "❌ Error collecting Twitter data. Please try again." };
    }
  }
};
