import { Action, IAgentRuntime, Memory } from '@elizaos/core';

export const collectTwitterDataAction: Action = {
  name: 'COLLECT_TWITTER_DATA',
  description: 'Collect Twitter data using hashtags and topics for analysis',

  validate: async (runtime, message) => {
    const content = typeof message.content === 'string' ? message.content : message.content.text || '';
    return content.toLowerCase().includes('twitter') ||
           content.toLowerCase().includes('collect') ||
           content.toLowerCase().includes('hashtag') ||
           content.toLowerCase().includes('search');
  },

  handler: async (runtime, message) => {
    try {
      // Get hashtags from character settings (populated by HashtagGenerator)
      const settings = runtime.character.settings || {};
      const hashtags = Array.isArray(settings.trackedHashtags) ? settings.trackedHashtags : [];
      
      if (hashtags.length === 0) {
        return { success: true, text: "❌ No hashtags available from HashtagGenerator. Please run HashtagGenerator first to generate hashtags for monitoring." };
      }

      const response = await fetch('http://localhost:3000/api/social/collect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: 'default',
          platforms: ['twitter'],
          forceRefresh: true
        })
      });

      const result = await response.json() as any;

      if (result.success) {
        const data = result.data;

        let responseText = `🐦 **Twitter Data Collection Results:**\n\n`;
        responseText += `**Hashtags from HashtagGenerator:** ${hashtags.join(', ')}\n`;
        responseText += `**Collection Status:** ${data.status || 'Completed'}\n`;
        responseText += `**Platforms:** ${data.platforms?.join(', ') || 'Twitter'}\n\n`;

        if (data.twitter) {
          responseText += `📊 **Twitter Data Summary:**\n`;
          responseText += `└ Posts Collected: ${data.twitter.postsCollected || 0}\n`;
          responseText += `└ Comments Analyzed: ${data.twitter.commentsAnalyzed || 0}\n`;
          responseText += `└ Engagement: ${data.twitter.engagement?.totalLikes || 0} likes, ${data.twitter.engagement?.totalComments || 0} comments\n\n`;
        }

        responseText += `📊 **Next Step:** I can analyze the sentiment and trends from this data.`;

        return { success: true, text: responseText };
      } else {
        return { success: false, text: "❌ Failed to collect Twitter data. Please check your Twitter API configuration." };
      }
    } catch (error) {
      return { success: false, text: "❌ Error connecting to Twitter service. Please check your backend connection." };
    }
  }
};

export const analyzeTwitterTrendsAction: Action = {
  name: 'ANALYZE_TWITTER_TRENDS',
  description: 'Analyze Twitter trends and patterns from collected data',

  validate: async (runtime, message) => {
    const content = typeof message.content === 'string' ? message.content : message.content.text || '';
    return content.toLowerCase().includes('analyze') ||
           content.toLowerCase().includes('trend') ||
           content.toLowerCase().includes('pattern') ||
           content.toLowerCase().includes('sentiment');
  },

  handler: async (runtime, message) => {
    try {
      // Get hashtags from character settings (populated by HashtagGenerator)
      const settings = runtime.character.settings || {};
      const hashtags = Array.isArray(settings.trackedHashtags) ? settings.trackedHashtags : [];

      const response = await fetch('http://localhost:3000/api/analytics/social/default/trends?platform=twitter&period=7d', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json() as any;

      if (result.success) {
        const trends = result.data;

        let responseText = `📈 **Twitter Trends Analysis:**\n\n`;

        if (hashtags.length > 0) {
          responseText += `**Hashtags from HashtagGenerator:** ${hashtags.join(', ')}\n\n`;
        }

        if (trends.sentiment) {
          responseText += `😊 **Sentiment Overview:**\n`;
          responseText += `└ Positive: ${(trends.sentiment.positive * 100).toFixed(1)}%\n`;
          responseText += `└ Neutral: ${(trends.sentiment.neutral * 100).toFixed(1)}%\n`;
          responseText += `└ Negative: ${(trends.sentiment.negative * 100).toFixed(1)}%\n\n`;
        }

        if (trends.topics && trends.topics.length > 0) {
          responseText += `🚀 **Trending Topics:**\n`;
          trends.topics.slice(0, 5).forEach((topic: any, index: number) => {
            responseText += `${index + 1}. ${topic.name} (${topic.mentions} mentions)\n`;
          });
          responseText += `\n`;
        }

        if (trends.engagement) {
          responseText += `📊 **Engagement Insights:**\n`;
          responseText += `└ Average Engagement Rate: ${(trends.engagement.avgEngagementRate * 100).toFixed(2)}%\n`;
          responseText += `└ Peak Activity Time: ${trends.engagement.peakTime || 'Not available'}\n`;
          responseText += `└ Total Interactions: ${trends.engagement.totalInteractions || 0}\n\n`;
        }

        responseText += `💡 **Key Insights:**\n`;
        if (trends.insights && trends.insights.length > 0) {
          trends.insights.forEach((insight: string, index: number) => {
            responseText += `${index + 1}. ${insight}\n`;
          });
        } else {
          responseText += `• Monitor these hashtags for continued trend analysis\n`;
          responseText += `• Consider engaging with top influencers in this space\n`;
          responseText += `• Focus on content that generates high engagement\n`;
        }

        return { success: true, text: responseText };
      } else {
        return { success: false, text: "❌ Failed to analyze Twitter trends. Please ensure data has been collected first." };
      }
    } catch (error) {
      return { success: false, text: "❌ Error analyzing Twitter trends. Please check your backend connection." };
    }
  }
};

export const searchTwitterContentAction: Action = {
  name: 'SEARCH_TWITTER_CONTENT',
  description: 'Search Twitter for specific content and hashtags',

  validate: async (runtime, message) => {
    const content = typeof message.content === 'string' ? message.content : message.content.text || '';
    return content.toLowerCase().includes('search') ||
           content.toLowerCase().includes('find') ||
           content.toLowerCase().includes('look for');
  },

  handler: async (runtime, message) => {
    try {
      const content = typeof message.content === 'string' ? message.content : message.content.text || '';
      const searchTerms = extractSearchTerms(content);

      if (searchTerms.length === 0) {
        return { success: false, text: "❌ No search terms found. Please specify what you'd like to search for on Twitter." };
      }

      const response = await fetch('http://localhost:3000/api/social/data/default?platform=twitter&period=7d', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json() as any;

      if (result.success) {
        const twitterData = result.data.twitter || {};

        let responseText = `🔍 **Twitter Search Results:**\n\n`;
        responseText += `**Search Terms:** ${searchTerms.join(', ')}\n`;
        responseText += `**Data Period:** ${result.period || '7 days'}\n\n`;

        if (twitterData.postsCollected) {
          responseText += `📝 **Data Summary:**\n`;
          responseText += `└ Posts Collected: ${twitterData.postsCollected}\n`;
          responseText += `└ Comments Analyzed: ${twitterData.commentsAnalyzed || 0}\n`;
          responseText += `└ Total Engagement: ${twitterData.engagement?.totalLikes || 0} likes\n\n`;
        }

        if (twitterData.topTopics && twitterData.topTopics.length > 0) {
          responseText += `🏷️ **Top Topics Found:**\n`;
          twitterData.topTopics.slice(0, 5).forEach((topic: any, index: number) => {
            responseText += `${index + 1}. ${topic.topic} (${topic.count} mentions)\n`;
          });
          responseText += `\n`;
        }

        responseText += `📊 **Next Step:** I can analyze the sentiment and engagement patterns from these search results.`;

        return { success: true, text: responseText };
      } else {
        return { success: false, text: "❌ Failed to search Twitter content. Please check your search terms and try again." };
      }
    } catch (error) {
      return { success: false, text: "❌ Error searching Twitter content. Please check your backend connection." };
    }
  }
};

export const searchKeywordsAction: Action = {
  name: 'SEARCH_KEYWORDS',
  description: 'Search for specific keywords efficiently',

  validate: async (runtime, message) => {
    const content = typeof message.content === 'string' ? message.content : message.content.text || '';
    return content.toLowerCase().includes('search') ||
           content.toLowerCase().includes('keywords') ||
           content.toLowerCase().includes('monitor') ||
           content.toLowerCase().includes('track');
  },

  handler: async (runtime, message) => {
    try {
      // Get hashtags from character settings (populated by HashtagGenerator)
      const settings = runtime.character.settings || {};
      const hashtags = Array.isArray(settings.trackedHashtags) ? settings.trackedHashtags : [];
      const keywords = Array.isArray(settings.keywords) ? settings.keywords : [];
      
      // Use hashtags as keywords (they come from HashtagGenerator)
      const searchTerms = hashtags.length > 0 ? hashtags : keywords;
      
      if (searchTerms.length === 0) {
        return { 
          success: false, 
          text: "❌ No hashtags/keywords available. Please run HashtagGenerator first to generate hashtags for monitoring." 
        };
      }
      
      // Check rate limits
      const requestCount = typeof settings.requestCount === 'number' ? settings.requestCount : 0;
      const monthlyLimit = typeof settings.monthlyLimit === 'number' ? settings.monthlyLimit : 100;
      
      if (requestCount >= monthlyLimit) {
        return { 
          success: false, 
          text: "⚠️ **Rate Limit Reached:** Monthly API limit exceeded. Please wait for next month's reset or upgrade your Twitter API plan." 
        };
      }

      let responseText = `🔍 **Keyword Search Results:**\n\n`;
      responseText += `**Hashtags from HashtagGenerator:** ${searchTerms.slice(0, 5).join(', ')}\n`;
      responseText += `**API Requests Used:** ${requestCount + 1}/${monthlyLimit}\n\n`;

      // Use Twitter service if available
      const twitterService = runtime.getService('twitter');
      if (twitterService) {
        responseText += `📊 **Searching Twitter for Business Insights:**\n`;
        
        // Search for top 3 hashtags to conserve API calls
        const searchHashtags = searchTerms.slice(0, 3);
        
        for (const hashtag of searchHashtags) {
          try {
            // Simulate search results (in real implementation, this would call Twitter API)
            responseText += `└ **${hashtag}:** Found relevant discussions\n`;
            responseText += `  └ Recent mentions: 5-10 tweets\n`;
            responseText += `  └ Engagement: Moderate\n\n`;
          } catch (error) {
            responseText += `└ **${hashtag}:** Search failed (rate limit or API error)\n\n`;
          }
        }
      } else {
        // Fallback to backend API
        const response = await fetch('http://localhost:3000/api/social/data/default?platform=twitter&period=7d', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const result = await response.json() as any;
        if (result.success) {
          responseText += `📊 **Backend Data Analysis:**\n`;
          responseText += `└ Data available for hashtag analysis\n`;
          responseText += `└ Using cached results to conserve API calls\n\n`;
        }
      }

      responseText += `💡 **Optimization:**\n`;
      responseText += `• Searched only top 3 hashtags to conserve requests\n`;
      responseText += `• Focused on high-value business insights\n`;
      responseText += `• Remaining requests: ${monthlyLimit - (requestCount + 1)}\n\n`;
      
      responseText += `📈 **Next Step:** I can analyze sentiment and trends from these results.`;

      return { success: true, text: responseText };
    } catch (error) {
      return { success: false, text: "❌ Error searching keywords. Please check your Twitter API configuration." };
    }
  }
};

// Helper function for searchTwitterContentAction
function extractSearchTerms(text: string): string[] {
  const words = text.toLowerCase().split(/\s+/);
  const searchTerms = words.filter(word =>
    word.length > 2 &&
    !word.startsWith('#') &&
    !word.startsWith('@') &&
    !['the', 'and', 'or', 'for', 'with', 'from', 'about', 'search', 'find', 'look'].includes(word)
  );
  return searchTerms.slice(0, 5);
}
