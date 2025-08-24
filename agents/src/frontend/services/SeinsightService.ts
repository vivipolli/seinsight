import { AnalysisResult, SessionResponse, Message, MessagesResponse } from '../types';
import { Prompts } from './prompts';
import { TwitterDataParser } from './twitterDataParser';

export class SeinsightService {
  private elizaosUrl = 'http://localhost:3000';
  private keywordsGeneratorId = '6045e764-c7b4-049a-9288-8a61c67c894c';
  private twitterCollectorId = '49694f6f-1a24-047d-b67f-1b3a56096764';
  private insightsCompilerId = '49694f6f-1a24-047d-b67f-1b3a56096764';
  private oracleAgentId = '8d382733-c09f-0d62-9f6e-cdb1afd3a4d0';
  private userId = '550e8400-e29b-41d4-a716-446655440000';
  private twitterDataParser = new TwitterDataParser();

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async performRealAnalysis(businessDescription: string): Promise<AnalysisResult> {
    const hashtags = await this.generateRealHashtags(businessDescription);
    const twitterData = await this.collectTwitterData(hashtags, businessDescription);
    const signalsResult = await this.generateSignals(businessDescription);
    const analysisResult = await this.performCriticalAnalysis(hashtags, businessDescription, twitterData);

    return { 
      hashtags, 
      analysis: analysisResult,
      signalsResult: signalsResult
    };
  }

  async generateSignals(businessDescription: string): Promise<any> {
    try {
      const sessionResponse = await fetch(`${this.elizaosUrl}/api/messaging/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: this.oracleAgentId,
          userId: this.userId,
          metadata: { platform: "frontend", purpose: "signal-generation" }
        })
      });

      if (!sessionResponse.ok) {
        throw new Error('Failed to create session for signal generation');
      }

      const sessionData = await sessionResponse.json() as SessionResponse;
      const sessionId = sessionData.sessionId;

      const messageResponse = await fetch(`${this.elizaosUrl}/api/messaging/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `GENERATE_TOP3_SIGNALS: ${businessDescription}`,
          metadata: { requestType: "signal-generation", action: "GENERATE_TOP3_SIGNALS" }
        })
      });

      if (!messageResponse.ok) {
        throw new Error('Failed to send signal generation message');
      }

      const agentResponse = await this.waitForAgentResponse(sessionId, 60);
      await fetch(`${this.elizaosUrl}/api/messaging/sessions/${sessionId}`, { method: 'DELETE' });

      return agentResponse;
    } catch (error) {
      console.error('Signal generation error:', error);
      return null;
    }
  }
 
  async collectTwitterData(hashtags: string[], businessDescription: string): Promise<any> {
    try {
      const sessionResponse = await fetch(`${this.elizaosUrl}/api/messaging/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: this.twitterCollectorId,
          userId: this.userId,
          metadata: { platform: "frontend", purpose: "twitter-collection" }
        })
      });

      if (!sessionResponse.ok) {
        throw new Error('Failed to create session for Twitter collection');
      }

      const sessionData = await sessionResponse.json() as SessionResponse;
      const sessionId = sessionData.sessionId;

      const messageResponse = await fetch(`${this.elizaosUrl}/api/messaging/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `Collect Twitter data using hashtags: ${hashtags.join(', ')} for: ${businessDescription}`,
          metadata: { requestType: "twitter-collection", action: "COLLECT_TWITTER_DATA", hashtags: hashtags }
        })
      });

      if (!messageResponse.ok) {
        throw new Error('Failed to send Twitter collection message');
      }

      const agentResponse = await this.waitForAgentResponse(sessionId, 60);
      await fetch(`${this.elizaosUrl}/api/messaging/sessions/${sessionId}`, { method: 'DELETE' });

      return this.twitterDataParser.parseTwitterData(agentResponse, hashtags);
    } catch (error) {
      console.error('Twitter collection error:', error);
      return null;
    }
  }

  async generateRealHashtags(businessDescription: string): Promise<string[]> {
    try {
      const sessionResponse = await fetch(`${this.elizaosUrl}/api/messaging/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: this.keywordsGeneratorId,
          userId: this.userId,
          metadata: { platform: "frontend", purpose: "hashtag-generation" }
        })
      });

      if (!sessionResponse.ok) {
        throw new Error('Failed to create hashtag session');
      }

      const sessionData = await sessionResponse.json() as SessionResponse;
      const sessionId = sessionData.sessionId;

      const messageResponse = await fetch(`${this.elizaosUrl}/api/messaging/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `GENERATE_HASHTAGS: ${businessDescription}`,
          metadata: { requestType: "hashtag-generation", action: "GENERATE_HASHTAGS" }
        })
      });

      if (!messageResponse.ok) {
        throw new Error('Failed to send message to agent');
      }

      const agentResponse = await this.waitForAgentResponse(sessionId, 60);
      await fetch(`${this.elizaosUrl}/api/messaging/sessions/${sessionId}`, { method: 'DELETE' });

      const hashtags = agentResponse.match(/#\w+/g) || [];
      
      if (hashtags.length > 0) {
        return hashtags;
      }

      const allText = agentResponse.toLowerCase();
      const potentialHashtags = allText.match(/#\w+/g) || [];
      
      if (potentialHashtags.length > 0) {
        return potentialHashtags;
      }

      throw new Error('No hashtags found in agent response');
    } catch (error) {
      console.error('Hashtag generation error:', error);
      throw error;
    }
  }
 
  async performCriticalAnalysis(hashtags: string[], businessDescription: string, twitterData: any): Promise<string> {
    try {
      const sessionResponse = await fetch(`${this.elizaosUrl}/api/messaging/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: this.insightsCompilerId,
          userId: this.userId,
          metadata: { platform: "frontend", purpose: "critical-analysis" }
        })
      });

      if (!sessionResponse.ok) {
        throw new Error('Failed to create critical analysis session');
      }

      const sessionData = await sessionResponse.json() as SessionResponse;
      const sessionId = sessionData.sessionId;

      const twitterDataSummary = this.twitterDataParser.formatTwitterDataForAnalysis(twitterData);
      const analysisRequest = Prompts.getCriticalAnalysisPrompt(businessDescription, hashtags, twitterDataSummary);

      const messageResponse = await fetch(`${this.elizaosUrl}/api/messaging/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: analysisRequest,
          metadata: { requestType: "critical-analysis", action: "CRITICAL_ANALYSIS" }
        })
      });

      if (!messageResponse.ok) {
        throw new Error('Failed to send critical analysis message');
      }

      const agentResponse = await this.waitForAgentResponse(sessionId, 60);
      await fetch(`${this.elizaosUrl}/api/messaging/sessions/${sessionId}`, { method: 'DELETE' });

      return agentResponse;
    } catch (error) {
      console.error('Critical analysis error:', error);
      return '❌ Error performing critical analysis. Please try again.';
    }
  }

  private async waitForAgentResponse(sessionId: string, maxAttempts: number): Promise<string> {
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      attempts++;
      await this.delay(5000);
      
      const messagesResponse = await fetch(`${this.elizaosUrl}/api/messaging/sessions/${sessionId}/messages`);
      const messagesData = await messagesResponse.json() as MessagesResponse;
      
      if (messagesData.messages && messagesData.messages.length > 0) {
        for (const msg of messagesData.messages) {
          if (msg.isAgent && msg.content) {
            return msg.content;
          }
        }
      }
    }

    throw new Error('Agent did not respond within time limit');
  }
}
