import { AnalysisResult, SessionResponse, Message, MessagesResponse } from '../types';
import { Prompts } from './prompts';
import { TwitterDataParser } from './twitterDataParser';
import { ProcessingStep } from '../hooks/useProcessingProgress';

export class SeinsightServiceWithProgressFixed {
  private elizaosUrl = 'http://localhost:3000';
  private keywordsGeneratorId = '6045e764-c7b4-049a-9288-8a61c67c894c';
  private twitterCollectorId = '49694f6f-1a24-047d-b67f-1b3a56096764';
  private insightsCompilerId = '8d382733-c09f-0d62-9f6e-cdb1afd3a4d0';
  private oracleAgentId = '8d382733-c09f-0d62-9f6e-cdb1afd3a4d0';
  private userId = '550e8400-e29b-41d4-a716-446655440000';
  private twitterDataParser = new TwitterDataParser();

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async performRealAnalysis(
    businessDescription: string, 
    onProgress?: (step: ProcessingStep) => void
  ): Promise<AnalysisResult> {
    try {
      // Step 1: Generate Hashtags
      onProgress?.('hashtags');
      const hashtags = await this.generateRealHashtags(businessDescription);

      // Step 2: Collect Twitter Data
      onProgress?.('twitter');
      const twitterData = await this.collectTwitterData(hashtags, businessDescription);

      // Step 3: Generate Signals (Blockchain)
      onProgress?.('blockchain');
      const signalsResult = await this.generateSignals(twitterData);

      // Step 4: Perform Analysis
      onProgress?.('analysis');
      const analysisResult = await this.performCriticalAnalysis(twitterData);

      return { 
        hashtags, 
        analysis: analysisResult,
        signalsResult: signalsResult
      };
    } catch (error) {
      console.error('Analysis error:', error);
      throw error;
    }
  }

  async generateSignals(twitterData: any): Promise<any> {
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

      const twitterDataSummary = this.twitterDataParser.formatTwitterDataForAnalysis(twitterData);
      const signalRequest = Prompts.getSignalGenerationPrompt(twitterDataSummary);

      const messageResponse = await fetch(`${this.elizaosUrl}/api/messaging/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: signalRequest,
          metadata: { requestType: "signal-generation", action: "GENERATE_TOP3_SIGNALS" }
        })
      });

      if (!messageResponse.ok) {
        throw new Error('Failed to send signal generation message');
      }

      const agentResponse = await this.waitForAgentResponse(sessionId);
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

      const agentResponse = await this.waitForAgentResponse(sessionId);
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
        throw new Error('Failed to create session for hashtag generation');
      }

      const sessionData = await sessionResponse.json() as SessionResponse;
      const sessionId = sessionData.sessionId;

      const messageResponse = await fetch(`${this.elizaosUrl}/api/messaging/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `Generate hashtags for: ${businessDescription}`,
          metadata: { requestType: "hashtag-generation", action: "GENERATE_HASHTAGS" }
        })
      });

      if (!messageResponse.ok) {
        throw new Error('Failed to send hashtag generation message');
      }

      const agentResponse = await this.waitForAgentResponse(sessionId);
      await fetch(`${this.elizaosUrl}/api/messaging/sessions/${sessionId}`, { method: 'DELETE' });

      return this.parseHashtags(agentResponse);
    } catch (error) {
      console.error('Hashtag generation error:', error);
      return [];
    }
  }

  async performCriticalAnalysis(twitterData: any): Promise<string> {
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
        throw new Error('Failed to create session for critical analysis');
      }

      const sessionData = await sessionResponse.json() as SessionResponse;
      const sessionId = sessionData.sessionId;

      const twitterDataSummary = this.twitterDataParser.formatTwitterDataForAnalysis(twitterData);
      const analysisPrompt = Prompts.getCriticalAnalysisPrompt(twitterDataSummary);

      const messageResponse = await fetch(`${this.elizaosUrl}/api/messaging/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: analysisPrompt,
          metadata: { requestType: "critical-analysis", action: "PERFORM_CRITICAL_ANALYSIS" }
        })
      });

      if (!messageResponse.ok) {
        throw new Error('Failed to send critical analysis message');
      }

      const agentResponse = await this.waitForAgentResponse(sessionId);
      await fetch(`${this.elizaosUrl}/api/messaging/sessions/${sessionId}`, { method: 'DELETE' });

      return agentResponse;
    } catch (error) {
      console.error('Critical analysis error:', error);
      return 'Analysis failed. Please try again.';
    }
  }

  private async waitForAgentResponse(sessionId: string, maxAttempts: number = 180): Promise<string> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await this.delay(1000);

      const messagesResponse = await fetch(`${this.elizaosUrl}/api/messaging/sessions/${sessionId}/messages`);
      if (!messagesResponse.ok) {
        continue;
      }

      const messagesData = await messagesResponse.json() as MessagesResponse;
      const agentMessages = messagesData.messages.filter(msg => msg.isAgent);

      if (agentMessages.length > 0) {
        const lastMessage = agentMessages[agentMessages.length - 1];
        if (lastMessage.content && lastMessage.content.trim()) {
          return lastMessage.content;
        }
      }
    }

    throw new Error('Timeout waiting for agent response');
  }

  private parseHashtags(response: string): string[] {
    const hashtagMatches = response.match(/#\w+/g);
    return hashtagMatches ? hashtagMatches.slice(0, 10) : [];
  }
}
