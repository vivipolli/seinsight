import { Action } from '@elizaos/core';

export const compileInsightsAction: Action = {
  name: 'COMPILE_INSIGHTS',
  description: 'Compile all collected insights into a comprehensive report',

  validate: async (runtime, message) => {
    const content = typeof message.content === 'string' ? message.content : message.content.text || '';
    return content.toLowerCase().includes('compile') ||
           content.toLowerCase().includes('insights') ||
           content.toLowerCase().includes('report') ||
           content.toLowerCase().includes('summary');
  },

  handler: async (runtime, message) => {
    try {
      // Call backend API to get insight history
      const response = await fetch('http://localhost:3000/api/insights/history/default?limit=5', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json() as any;

      if (result.success) {
        const history = result.data;
        
        let responseText = `📋 **Insights Compilation Report:**\n\n`;
        responseText += `**Total Insights Analyzed:** ${history.length}\n`;
        responseText += `**Analysis Period:** Recent insights\n\n`;

        if (history.length > 0) {
          responseText += `📊 **Recent Insights Summary:**\n`;
          
          history.slice(0, 3).forEach((insight: any, index: number) => {
            responseText += `${index + 1}. **${insight.timestamp || 'Recent'}**\n`;
            
            if (insight.hashtags?.generated) {
              responseText += `   └ Hashtags: ${insight.hashtags.generated.slice(0, 3).join(', ')}\n`;
            }
            
            if (insight.socialMedia?.postsCollected) {
              responseText += `   └ Posts: ${insight.socialMedia.postsCollected}, Engagement: ${insight.socialMedia.engagement?.averageEngagement || 0}\n`;
            }
            
            if (insight.sentiment?.overall) {
              responseText += `   └ Sentiment: ${insight.sentiment.overall}\n`;
            }
            
            responseText += `\n`;
          });
        }

        // Get overall statistics
        const statsResponse = await fetch('http://localhost:3000/api/insights/stats/default', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const statsResult = await statsResponse.json() as any;

        if (statsResult.success) {
          const stats = statsResult.data;
          
          responseText += `📈 **Overall Performance:**\n`;
          responseText += `└ Total Insights: ${stats.totalInsights}\n`;
          responseText += `└ Avg Execution Time: ${(stats.averageExecutionTime / 1000).toFixed(1)}s\n`;
          responseText += `└ Total Posts Analyzed: ${stats.totalPostsCollected}\n`;
          responseText += `└ Avg Engagement Score: ${stats.averageEngagementScore}\n\n`;
        }

        responseText += `💡 **Key Recommendations:**\n`;
        responseText += `• Continue monitoring trending hashtags for engagement opportunities\n`;
        responseText += `• Focus on content that generates positive sentiment\n`;
        responseText += `• Leverage insights for strategic content planning\n`;

        return { success: true, text: responseText };
      } else {
        return { success: false, text: "❌ Failed to compile insights. Please ensure insights have been generated first." };
      }
    } catch (error) {
      return { success: false, text: "❌ Error compiling insights. Please check your backend connection." };
    }
  }
};

export const generateStrategicReportAction: Action = {
  name: 'GENERATE_STRATEGIC_REPORT',
  description: 'Generate strategic recommendations based on compiled insights',

  validate: async (runtime, message) => {
    const content = typeof message.content === 'string' ? message.content : message.content.text || '';
    return content.toLowerCase().includes('strategic') ||
           content.toLowerCase().includes('recommendations') ||
           content.toLowerCase().includes('strategy') ||
           content.toLowerCase().includes('plan');
  },

  handler: async (runtime, message) => {
    try {
      // Get latest insight for strategic analysis
      const response = await fetch('http://localhost:3000/api/insights/history/default?limit=1', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json() as any;

      if (result.success && result.data.length > 0) {
        const latestInsight = result.data[0];
        
        let responseText = `🎯 **Strategic Recommendations Report:**\n\n`;
        responseText += `**Based on Latest Analysis:** ${latestInsight.timestamp || 'Recent'}\n\n`;

        if (latestInsight.insights?.summary) {
          responseText += `📊 **Current Performance:**\n`;
          responseText += `└ Overall Sentiment: ${latestInsight.insights.summary.overallSentiment}\n`;
          responseText += `└ Top Topic: ${latestInsight.insights.summary.topTopic}\n`;
          responseText += `└ Engagement Score: ${latestInsight.insights.summary.engagementScore}\n\n`;
        }

        if (latestInsight.insights?.recommendations) {
          responseText += `🎯 **Strategic Recommendations:**\n`;
          latestInsight.insights.recommendations.forEach((rec: any, index: number) => {
            responseText += `${index + 1}. **${rec.type.toUpperCase()}** - ${rec.suggestion}\n`;
            responseText += `   └ Priority: ${rec.priority}\n\n`;
          });
        }

        if (latestInsight.insights?.opportunities) {
          responseText += `🚀 **Growth Opportunities:**\n`;
          latestInsight.insights.opportunities.forEach((opp: any, index: number) => {
            responseText += `${index + 1}. **${opp.type.toUpperCase()}** - ${opp.description}\n`;
            responseText += `   └ Priority: ${opp.priority}, Confidence: ${(opp.confidence * 100).toFixed(1)}%\n\n`;
          });
        }

        if (latestInsight.actionItems) {
          responseText += `📋 **Action Items:**\n`;
          latestInsight.actionItems.forEach((action: any, index: number) => {
            responseText += `${index + 1}. **${action.type.toUpperCase()}** - ${action.action}\n`;
            responseText += `   └ ${action.description}\n`;
            responseText += `   └ Priority: ${action.priority}, Timeline: ${action.timeline}\n\n`;
          });
        }

        responseText += `📈 **Next Steps:**\n`;
        responseText += `• Implement high-priority recommendations\n`;
        responseText += `• Monitor performance metrics\n`;
        responseText += `• Schedule follow-up analysis\n`;

        return { success: true, text: responseText };
      } else {
        return { success: false, text: "❌ Failed to generate strategic report. Please ensure insights have been generated first." };
      }
    } catch (error) {
      return { success: false, text: "❌ Error generating strategic report. Please check your backend connection." };
    }
  }
};
