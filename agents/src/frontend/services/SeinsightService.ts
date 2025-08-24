import { AnalysisResult } from '../types';
import { Prompts } from './prompts';
import { TwitterDataParser } from './twitterDataParser';
import { ProcessingStep } from '../hooks/useProcessingProgress';
import { ELIZA_API_URL } from '../config/api';
import { parseHashtags, retryWithBackoff, waitForAgentResponse, type SessionResponse } from '../utils/retryUtils';

export class SeinsightServiceWithProgressFixed {
  private elizaosUrl = ELIZA_API_URL;
  private keywordsGeneratorId = '6045e764-c7b4-049a-9288-8a61c67c894c';
  private twitterCollectorId = '49694f6f-1a24-047d-b67f-1b3a56096764';
  private insightsCompilerId = '8d382733-c09f-0d62-9f6e-cdb1afd3a4d0';
  private oracleAgentId = '8d382733-c09f-0d62-9f6e-cdb1afd3a4d0';
  private userId = '550e8400-e29b-41d4-a716-446655440000';
  private twitterDataParser = new TwitterDataParser();
  private processingCache = new Map<string, Promise<any>>();


  async performRealAnalysis(
    businessDescription: string, 
    onProgress?: (step: ProcessingStep) => void
  ): Promise<AnalysisResult> {
    const cacheKey = `analysis_${businessDescription.trim().toLowerCase().substring(0, 50)}`;
    
    // Check if already processing
    if (this.processingCache.has(cacheKey)) {
      return await this.processingCache.get(cacheKey);
    }

    // Create new processing promise
    const analysisPromise = this.performAnalysisInternal(businessDescription, onProgress);
    this.processingCache.set(cacheKey, analysisPromise);

    try {
      const result = await analysisPromise;
      return result;
    } finally {
      // Clean up cache after completion
      this.processingCache.delete(cacheKey);
    }
  }

  private async performAnalysisInternal(
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

      // Step 3 & 4: Generate Signals and Analysis in parallel (both use same twitter data)
      onProgress?.('blockchain');
      const [signalsResult, analysisResult] = await Promise.all([
        this.generateSignals(twitterData),
        this.performCriticalAnalysis(twitterData)
      ]);
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
    return retryWithBackoff(async () => {
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

      const agentResponse = await waitForAgentResponse(this.elizaosUrl, sessionId);
      await fetch(`${this.elizaosUrl}/api/messaging/sessions/${sessionId}`, { method: 'DELETE' });

      return agentResponse;
    }, 2); // Retry up to 2 times for signals
  }
 
  async collectTwitterData(hashtags: string[], businessDescription: string): Promise<any> {
    return retryWithBackoff(async () => {
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

      const agentResponse = await waitForAgentResponse(this.elizaosUrl, sessionId);
      await fetch(`${this.elizaosUrl}/api/messaging/sessions/${sessionId}`, { method: 'DELETE' });

      return this.twitterDataParser.parseTwitterData(agentResponse, hashtags);
    }, 2); // Retry up to 2 times for Twitter collection
  }

  async generateRealHashtags(businessDescription: string): Promise<string[]> {
    return retryWithBackoff(async () => {
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

      const agentResponse = await waitForAgentResponse(this.elizaosUrl, sessionId);
      await fetch(`${this.elizaosUrl}/api/messaging/sessions/${sessionId}`, { method: 'DELETE' });

      return parseHashtags(agentResponse);
    }, 3); // Retry up to 3 times
  }

  async performCriticalAnalysis(twitterData: any): Promise<string> {
    return retryWithBackoff(async () => {
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

      const agentResponse = await waitForAgentResponse(this.elizaosUrl, sessionId);
      await fetch(`${this.elizaosUrl}/api/messaging/sessions/${sessionId}`, { method: 'DELETE' });

      return agentResponse;
    }, 2); // Retry up to 2 times for critical analysis
  }


}
