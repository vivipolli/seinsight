import { Action, IAgentRuntime, Memory } from '@elizaos/core';
import { twitterMockData } from '../mocks/twitterMockData.js';

export const collectTwitterDataAction: Action = {
  name: 'COLLECT_TWITTER_DATA',
  description: 'Collect Twitter data using hashtags and topics for analysis',

  validate: async (runtime, message) => {
    return true;
  },

  handler: async (runtime, message) => {
    try {
      console.log('🐦 collectTwitterDataAction triggered!');
      
      // Get hashtags from character settings (populated by HashtagGenerator)
      const settings = runtime.character.settings || {};
      const hashtags = Array.isArray(settings.trackedHashtags) ? settings.trackedHashtags : [];
      
      if (hashtags.length === 0) {
        return { success: true, text: "❌ No hashtags available from HashtagGenerator. Please run HashtagGenerator first to generate hashtags for monitoring." };
      }

      // Use mock data instead of API calls
      const mockTweets = twitterMockData.tweets;
      
      // Calculate engagement metrics from mock data
      const totalLikes = mockTweets.reduce((sum, tweet) => sum + tweet.like_count, 0);
      const totalRetweets = mockTweets.reduce((sum, tweet) => sum + tweet.retweet_count, 0);
      const totalEngagement = totalLikes + totalRetweets;
      
      // Extract hashtags from mock tweets
      const extractedHashtags = new Set<string>();
      mockTweets.forEach(tweet => {
        const hashtagMatches = tweet.text.match(/#\w+/g);
        if (hashtagMatches) {
          hashtagMatches.forEach(hashtag => extractedHashtags.add(hashtag));
        }
      });

      let responseText = `🐦 **Twitter Data Collection Results:**\n\n`;
      responseText += `**Hashtags from HashtagGenerator:** ${hashtags.join(', ')}\n`;
      responseText += `**Collection Status:** ✅ Completed (Mock Data)\n`;
      responseText += `**Platforms:** Twitter\n\n`;

      responseText += `📊 **Twitter Data Summary:**\n`;
      responseText += `└ Posts Collected: ${mockTweets.length}\n`;
      responseText += `└ Total Engagement: ${totalEngagement} (${totalLikes} likes, ${totalRetweets} retweets)\n`;
      responseText += `└ Hashtags Found: ${Array.from(extractedHashtags).join(', ')}\n`;
      responseText += `└ Time Range: Last 24 hours\n\n`;

      responseText += `\n📈 **Next Step:** Use "generate top 3 signals" to publish trending signals to the oracle.`;

      // Store collected data in runtime settings for oracle integration
      const updatedSettings = { ...settings };
      const twitterData = {
        tweets: mockTweets,
        totalEngagement,
        totalLikes,
        totalRetweets,
        hashtags: Array.from(extractedHashtags),
        collectedAt: new Date().toISOString()
      };
      updatedSettings.twitterData = twitterData;
      runtime.character.settings = updatedSettings;
      
      console.log('💾 Twitter data saved to runtime settings:', {
        tweetsCount: mockTweets.length,
        totalEngagement,
        hashtags: Array.from(extractedHashtags)
      });

      return { 
        success: true, 
        text: responseText,
        metadata: {
          twitterData: twitterData
        }
      };
    } catch (error) {
      console.error('❌ Error collecting Twitter data:', error);
      return { success: false, text: "❌ Error collecting Twitter data. Please try again." };
    }
  }
};
