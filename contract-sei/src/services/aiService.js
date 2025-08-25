const logger = require('../utils/logger');

const aiService = {
  async generateHashtagsFromReport(businessReport) {
    try {
      logger.info('Generating hashtags from business report via ElizaOS HashtagGenerator');
      
      // Call ElizaOS HashtagGenerator agent
      const elizaResponse = await this.callElizaOSHashtagGenerator(businessReport);
      
      if (elizaResponse.success) {
        return {
          success: true,
          hashtags: elizaResponse.hashtags,
          analysis: elizaResponse.analysis
        };
      } else {
        // If ElizaOS fails, return error - no fallback hashtags
        logger.error('ElizaOS HashtagGenerator failed to respond');
        return {
          success: false,
          error: 'ElizaOS HashtagGenerator agent is not responding'
        };
      }
    } catch (error) {
      logger.error('Error generating hashtags from report:', error);
      return {
        success: false,
        error: 'Failed to generate hashtags from report: ' + error.message
      };
    }
  },

  // Call ElizaOS HashtagGenerator agent using Sessions API
  async callElizaOSHashtagGenerator(businessReport) {
    try {
      const axios = require('axios');
      const elizaUrl = process.env.ELIZAOS_URL || 'http://localhost:3000';
      
      // Step 1: Create a session with the HashtagGenerator agent
      const sessionResponse = await axios.post(`${elizaUrl}/api/messaging/sessions`, {
        agentId: '635b4207-35ce-0ec5-a517-52445ae58215', // HashtagGenerator UUID
        userId: '550e8400-e29b-41d4-a716-446655440000', // Valid UUID
        metadata: {
          platform: 'backend',
          purpose: 'hashtag-generation',
          businessReport: businessReport.substring(0, 100) + '...' // Truncate for metadata
        }
      });
      
      if (!sessionResponse.data.sessionId) {
        throw new Error('Failed to create session with HashtagGenerator');
      }
      
      const sessionId = sessionResponse.data.sessionId;
      logger.info(`Created session ${sessionId} with HashtagGenerator`);
      
      // Step 2: Send the business report to generate hashtags
      await axios.post(
        `${elizaUrl}/api/messaging/sessions/${sessionId}/messages`,
        {
          content: `Generate hashtags for: ${businessReport}`,
          metadata: {
            requestType: 'hashtag-generation',
            timestamp: new Date().toISOString()
          }
        }
      );
      
      // Step 3: Wait for agent response
      await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30 seconds
      
      // Step 4: Get messages from session
      const messagesResponse = await axios.get(`${elizaUrl}/api/messaging/sessions/${sessionId}/messages`);
      
      if (messagesResponse.data && messagesResponse.data.messages) {
        // Find the agent's response (last message from agent)
        const agentMessages = messagesResponse.data.messages.filter(msg => msg.isAgent);
        if (agentMessages.length > 0) {
          const agentResponse = agentMessages[agentMessages.length - 1].content;
          const hashtags = this.extractHashtagsFromResponse(agentResponse);
          
          // Step 5: End the session
          await axios.delete(`${elizaUrl}/api/messaging/sessions/${sessionId}`);
          
          return {
            success: true,
            hashtags: hashtags,
            analysis: {
              agentResponse: agentResponse,
              sessionId: sessionId,
              confidence: 0.85
            }
          };
        } else {
          // Clean up session on error
          await axios.delete(`${elizaUrl}/api/messaging/sessions/${sessionId}`);
          return { success: false };
        }
      } else {
        // Clean up session on error
        await axios.delete(`${elizaUrl}/api/messaging/sessions/${sessionId}`);
        return { success: false };
      }
    } catch (error) {
      logger.error('Error calling ElizaOS HashtagGenerator:', error);
      return { success: false };
    }
  },

  // Extract hashtags from agent response
  extractHashtagsFromResponse(response) {
    if (!response || typeof response !== 'string') {
      return [];
    }
    
    // Extract hashtags that start with #
    const hashtags = response.match(/#\w+/g) || [];
    
    // Remove duplicates and return
    return [...new Set(hashtags)];
  },

  // Parse insights from agent response
  parseInsightsFromResponse(response) {
    if (!response || typeof response !== 'string') {
      return {
        summary: 'No analysis available',
        recommendations: [],
        opportunities: [],
        actionItems: []
      };
    }
    
    return {
      summary: response,
      recommendations: [],
      opportunities: [],
      actionItems: []
    };
  },

  // Analyze social media comments and generate insights via ElizaOS InsightCompiler
  async analyzeSocialComments(comments) {
    try {
      logger.info('Analyzing social media comments via ElizaOS InsightCompiler');
      
      // Call ElizaOS InsightCompiler agent
      const elizaResponse = await this.callElizaOSInsightCompiler(comments);
      
      if (elizaResponse.success) {
        return {
          success: true,
          insights: elizaResponse.insights,
          summary: elizaResponse.summary
        };
      } else {
        logger.error('ElizaOS InsightCompiler failed to respond');
        return {
          success: false,
          error: 'ElizaOS InsightCompiler agent is not responding'
        };
      }
    } catch (error) {
      logger.error('Error analyzing social comments:', error);
      return {
        success: false,
        error: 'Failed to analyze social comments: ' + error.message
      };
    }
  },

  // Call ElizaOS InsightCompiler agent using Sessions API
  async callElizaOSInsightCompiler(comments) {
    try {
      const axios = require('axios');
      const elizaUrl = process.env.ELIZAOS_URL || 'http://localhost:3000';
      
      // Step 1: Create a session with the InsightCompiler agent
      const sessionResponse = await axios.post(`${elizaUrl}/api/messaging/sessions`, {
        agentId: '3643e20d-b322-0e3e-a089-87f323dc94ad', // InsightCompiler UUID
        userId: '550e8400-e29b-41d4-a716-446655440000', // Valid UUID
        metadata: {
          platform: 'backend',
          purpose: 'insight-compilation',
          commentCount: comments.length
        }
      });
      
      if (!sessionResponse.data.sessionId) {
        throw new Error('Failed to create session with InsightCompiler');
      }
      
      const sessionId = sessionResponse.data.sessionId;
      logger.info(`Created session ${sessionId} with InsightCompiler`);
      
      // Step 2: Send the comments for analysis
      await axios.post(
        `${elizaUrl}/api/messaging/sessions/${sessionId}/messages`,
        {
          content: JSON.stringify(comments),
          metadata: {
            requestType: 'insight-compilation',
            timestamp: new Date().toISOString()
          }
        }
      );
      
      // Step 3: Wait for agent response
      await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30 seconds
      
      // Step 4: Get messages from session
      const messagesResponse = await axios.get(`${elizaUrl}/api/messaging/sessions/${sessionId}/messages`);
      
      if (messagesResponse.data && messagesResponse.data.messages) {
        // Find the agent's response (last message from agent)
        const agentMessages = messagesResponse.data.messages.filter(msg => msg.isAgent);
        if (agentMessages.length > 0) {
          const agentResponse = agentMessages[agentMessages.length - 1].content;
          const insights = this.parseInsightsFromResponse(agentResponse);
          
          // Step 5: End the session
          await axios.delete(`${elizaUrl}/api/messaging/sessions/${sessionId}`);
          
          return {
            success: true,
            insights: insights,
            summary: {
              agentResponse: agentResponse,
              sessionId: sessionId,
              commentCount: comments.length
            }
          };
        } else {
          // Clean up session on error
          await axios.delete(`${elizaUrl}/api/messaging/sessions/${sessionId}`);
          return { success: false };
        }
      } else {
        // Clean up session on error
        await axios.delete(`${elizaUrl}/api/messaging/sessions/${sessionId}`);
        return { success: false };
      }
    } catch (error) {
      logger.error('Error calling ElizaOS InsightCompiler:', error);
      return { success: false };
    }
  }
};

module.exports = aiService;
