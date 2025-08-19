import { Action } from '@elizaos/core';

export const collectInstagramDataAction: Action = {
  name: 'COLLECT_INSTAGRAM_DATA',
  description: 'Collect Instagram data for hashtags using Apify',

  validate: async (runtime, message) => {
    const content = typeof message.content === 'string' ? message.content : message.content.text || '';
    return content.toLowerCase().includes('instagram') ||
           content.toLowerCase().includes('collect') ||
           content.toLowerCase().includes('hashtag') ||
           content.toLowerCase().includes('apify');
  },

  handler: async (runtime, message) => {
    try {
      // Extract hashtags from message
      const content = typeof message.content === 'string' ? message.content : message.content.text || '';
      const hashtags = extractHashtags(content);
      
      if (hashtags.length === 0) {
        return { success: true, text: "❌ No hashtags found in your request. Please provide hashtags to collect Instagram data." };
      }

      // Call backend API to collect social data (including Instagram)
      const response = await fetch('http://localhost:3000/api/social/collect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: 'default', // Using default project for now
          platforms: ['instagram'],
          forceRefresh: true
        })
      });

      const result = await response.json() as any;

      if (result.success) {
        const data = result.data;
        
        let responseText = `📸 **Instagram Data Collection Results:**\n\n`;
        responseText += `**Hashtags Searched:** ${hashtags.join(', ')}\n`;
        responseText += `**Collection Status:** ${data.status || 'Completed'}\n`;
        responseText += `**Platforms:** ${data.platforms?.join(', ') || 'Instagram'}\n\n`;

        if (data.instagram) {
          responseText += `📊 **Instagram Data Summary:**\n`;
          responseText += `└ Posts Collected: ${data.instagram.postsCollected || 0}\n`;
          responseText += `└ Comments Analyzed: ${data.instagram.commentsAnalyzed || 0}\n`;
          responseText += `└ Engagement: ${data.instagram.engagement?.totalLikes || 0} likes, ${data.instagram.engagement?.totalComments || 0} comments\n\n`;
        }

        responseText += `📊 **Next Step:** I can analyze the sentiment and trends from this data.`;

        return { success: true, text: responseText };
      } else {
        return { success: false, text: "❌ Failed to collect Instagram data. Please check your Apify configuration." };
      }
    } catch (error) {
      return { success: false, text: "❌ Error connecting to Instagram service. Please check your backend connection." };
    }
  }
};

export const analyzeInstagramSentimentAction: Action = {
  name: 'ANALYZE_INSTAGRAM_SENTIMENT',
  description: 'Analyze sentiment and trends from Instagram data',

  validate: async (runtime, message) => {
    const content = typeof message.content === 'string' ? message.content : message.content.text || '';
    return content.toLowerCase().includes('analyze') ||
           content.toLowerCase().includes('sentiment') ||
           content.toLowerCase().includes('instagram') ||
           content.toLowerCase().includes('trend');
  },

  handler: async (runtime, message) => {
    try {
      // Call backend API to get sentiment analysis for Instagram
      const response = await fetch('http://localhost:3000/api/analytics/social/default/sentiment?platform=instagram&period=7d', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json() as any;

      if (result.success) {
        const sentiment = result.data;
        
        let responseText = `📊 **Instagram Sentiment Analysis:**\n\n`;
        responseText += `**Analysis Period:** ${result.period || '7 days'}\n`;
        responseText += `**Platform:** Instagram\n\n`;

        if (sentiment.overall) {
          responseText += `😊 **Overall Sentiment:**\n`;
          responseText += `└ Sentiment: ${sentiment.overall}\n`;
          responseText += `└ Confidence: ${(sentiment.confidence * 100).toFixed(1)}%\n\n`;
        }

        if (sentiment.breakdown) {
          responseText += `📈 **Sentiment Breakdown:**\n`;
          responseText += `└ Positive: ${sentiment.breakdown.positive}%\n`;
          responseText += `└ Neutral: ${sentiment.breakdown.neutral}%\n`;
          responseText += `└ Negative: ${sentiment.breakdown.negative}%\n\n`;
        }

        if (sentiment.trends && sentiment.trends.length > 0) {
          responseText += `📊 **Key Trends:**\n`;
          sentiment.trends.slice(0, 3).forEach((trend: any, index: number) => {
            responseText += `${index + 1}. ${trend.description}\n`;
            responseText += `   └ Confidence: ${(trend.confidence * 100).toFixed(1)}%\n\n`;
          });
        }

        responseText += `💡 **Insights:**\n`;
        if (sentiment.insights && sentiment.insights.length > 0) {
          sentiment.insights.forEach((insight: string, index: number) => {
            responseText += `${index + 1}. ${insight}\n`;
          });
        } else {
          responseText += `• Monitor sentiment trends over time\n`;
          responseText += `• Focus on content that generates positive engagement\n`;
          responseText += `• Consider community feedback patterns\n`;
        }

        return { success: true, text: responseText };
      } else {
        return { success: false, text: "❌ Failed to analyze Instagram sentiment. Please ensure data has been collected first." };
      }
    } catch (error) {
      return { success: false, text: "❌ Error analyzing Instagram sentiment. Please check your backend connection." };
    }
  }
};

// Helper functions
function extractHashtags(text: string): string[] {
  const hashtagRegex = /#(\w+)/g;
  const matches = text.match(hashtagRegex);
  return matches ? matches.map(tag => tag.substring(1)) : [];
}
