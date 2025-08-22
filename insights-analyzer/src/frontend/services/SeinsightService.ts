import { AnalysisResult, SessionResponse, Message, MessagesResponse } from '../types';

export class SeinsightService {
  private elizaosUrl = 'http://localhost:3000';
  private hashtagGeneratorId = '635b4207-35ce-0ec5-a517-52445ae58215';
  private twitterCollectorId = '3643e20d-b322-0e3e-a089-87f323dc94ad';
  private insightCompilerId = '3643e20d-b322-0e3e-a089-87f323dc94ad';
  private userId = '550e8400-e29b-41d4-a716-446655440000';

  async performRealAnalysis(businessDescription: string): Promise<AnalysisResult> {
    console.log('Starting REAL analysis for:', businessDescription);

    // Step 1: Generate hashtags using REAL ElizaOS HashtagGenerator
    const hashtags = await this.generateRealHashtags(businessDescription);

    // Step 2: Collect Twitter data using hashtags generated
    await this.collectTwitterData(hashtags, businessDescription);

    // Step 3: Generate signals from Twitter data and publish to oracle
    await this.generateSignalsFromTwitterData(businessDescription);

    // Step 4: Analyze market data using REAL ElizaOS InsightCompiler
    const analysis = await this.analyzeRealMarket(hashtags, businessDescription);

    return { hashtags, analysis };
  }

  async collectTwitterData(hashtags: string[], businessDescription: string): Promise<void> {
    try {
      // Create session with TwitterCollector
      const sessionResponse = await fetch(`${this.elizaosUrl}/api/messaging/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId: this.insightCompilerId, // Using InsightCompiler for now
          userId: this.userId,
          metadata: {
            platform: "frontend",
            purpose: "twitter-collection"
          }
        })
      });

      if (!sessionResponse.ok) {
        throw new Error('Failed to create Twitter collection session');
      }

      const sessionData = await sessionResponse.json() as SessionResponse;
      const sessionId = sessionData.sessionId;

      // Send message to collect Twitter data using hashtags
      await fetch(`${this.elizaosUrl}/api/messaging/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: `Collect Twitter data using hashtags: ${hashtags.join(', ')} for: ${businessDescription}`,
          metadata: {
            requestType: "twitter-collection",
            hashtags: hashtags
          }
        })
      });

      // Wait for agent response
      await this.delay(30000);

      // Clean up session
      await fetch(`${this.elizaosUrl}/api/messaging/sessions/${sessionId}`, {
        method: 'DELETE'
      });

    } catch (error) {
      console.error('Twitter collection error:', error);
      // Don't throw error, continue with analysis
    }
  }

  async generateSignalsFromTwitterData(businessDescription: string): Promise<void> {
    try {
      // Create session with InsightCompiler for oracle signals
      const sessionResponse = await fetch(`${this.elizaosUrl}/api/messaging/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId: this.insightCompilerId,
          userId: this.userId,
          metadata: {
            platform: "frontend",
            purpose: "oracle-signals"
          }
        })
      });

      if (!sessionResponse.ok) {
        throw new Error('Failed to create oracle signals session');
      }

      const sessionData = await sessionResponse.json() as SessionResponse;
      const sessionId = sessionData.sessionId;

      // Send message to generate signals from Twitter data
      await fetch(`${this.elizaosUrl}/api/messaging/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: `Generate top 3 signals from collected Twitter data for: ${businessDescription}`,
          metadata: {
            requestType: "oracle-signals",
            source: "twitter-data"
          }
        })
      });

      // Wait for agent response
      await this.delay(30000);

      // Clean up session
      await fetch(`${this.elizaosUrl}/api/messaging/sessions/${sessionId}`, {
        method: 'DELETE'
      });

    } catch (error) {
      console.error('Oracle signals generation error:', error);
      // Don't throw error, continue with analysis
    }
  }

  async generateRealHashtags(businessDescription: string): Promise<string[]> {
    try {
      // Create session with HashtagGenerator
      const sessionResponse = await fetch(`${this.elizaosUrl}/api/messaging/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId: this.hashtagGeneratorId,
          userId: this.userId,
          metadata: {
            platform: "frontend",
            purpose: "hashtag-generation"
          }
        })
      });

      if (!sessionResponse.ok) {
        throw new Error('Failed to create hashtag session');
      }

      const sessionData = await sessionResponse.json() as SessionResponse;
      const sessionId = sessionData.sessionId;

      // Send message to generate hashtags
      await fetch(`${this.elizaosUrl}/api/messaging/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: businessDescription,
          metadata: {
            requestType: "hashtag-generation"
          }
        })
      });

      // Wait for agent response - increased time for complete analysis
      await this.delay(30000);

      // Get messages from session
      const messagesResponse = await fetch(`${this.elizaosUrl}/api/messaging/sessions/${sessionId}/messages`);
      const messagesData = await messagesResponse.json() as MessagesResponse;

      if (messagesData.messages) {
        const agentMessages = messagesData.messages.filter((msg: Message) => msg.isAgent);
        if (agentMessages.length > 0) {
          const agentResponse = agentMessages[agentMessages.length - 1].content;
          const hashtags = agentResponse.match(/#\w+/g) || [];

          // Clean up session
          await fetch(`${this.elizaosUrl}/api/messaging/sessions/${sessionId}`, {
            method: 'DELETE'
          });

          return hashtags;
        }
      }

      throw new Error('No hashtags generated');
    } catch (error) {
      console.error('Hashtag generation error:', error);
      throw error;
    }
  }

  async analyzeRealMarket(hashtags: string[], businessDescription: string): Promise<string> {
    try {
      // Create session with InsightCompiler
      const sessionResponse = await fetch(`${this.elizaosUrl}/api/messaging/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId: this.insightCompilerId,
          userId: this.userId,
          metadata: {
            platform: "frontend",
            purpose: "critical-analysis"
          }
        })
      });

      if (!sessionResponse.ok) {
        throw new Error('Failed to create analysis session');
      }

      const sessionData = await sessionResponse.json() as SessionResponse;
      const sessionId = sessionData.sessionId;

      // Send analysis request
      const analysisRequest = `Analyze this business idea for Web3 entrepreneurs with a critical and balanced perspective:

Hashtags: ${hashtags.join(', ')}
Business Context: ${businessDescription}

Please provide a critical analysis that includes:
1. Market risks and challenges
2. Potential obstacles and limitations
3. Competitive landscape considerations
4. Realistic opportunities (not overly optimistic)
5. Potential failure points to watch for
6. Balanced recommendations considering both opportunities and risks

Be objective, data-driven, and avoid overly positive bias. Focus on actionable insights that help entrepreneurs make informed decisions.`;

      await fetch(`${this.elizaosUrl}/api/messaging/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: analysisRequest,
          metadata: {
            requestType: "critical-analysis"
          }
        })
      });

      // Wait for analysis response - increased time for complete analysis
      await this.delay(35000);

      // Get analysis messages
      const messagesResponse = await fetch(`${this.elizaosUrl}/api/messaging/sessions/${sessionId}/messages`);
      const messagesData = await messagesResponse.json() as MessagesResponse;

      if (messagesData.messages) {
        const agentMessages = messagesData.messages.filter((msg: Message) => msg.isAgent);
        if (agentMessages.length > 0) {
          const analysisResponse = agentMessages[agentMessages.length - 1].content;
          console.log('InsightCompiler response:', analysisResponse);

          // Clean up session
          await fetch(`${this.elizaosUrl}/api/messaging/sessions/${sessionId}`, {
            method: 'DELETE'
          });

          return analysisResponse;
        }
      }

      throw new Error('No analysis response received');
    } catch (error) {
      console.error('Market analysis error:', error);
      throw error;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
